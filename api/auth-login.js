import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  if (user !== 'admin' || pass !== '123') {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }

  const token = jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  res.setHeader('Set-Cookie', cookie.serialize('AUTH', token, {
    httpOnly: true,
    secure: true,          // HTTPS (Vercel)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30
  }));

  return res.json({
    success: true,
    user
  });
}
