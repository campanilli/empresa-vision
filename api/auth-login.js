import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return res.status(500).json({ error: 'Senha não configurada no ambiente' });
  }

  if (user !== 'admin') {
    return res.status(401).json({ success: false });
  }

  const isValid = await bcrypt.compare(pass, hash);

  if (!isValid) {
    return res.status(401).json({ success: false });
  }

  const token = jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  res.setHeader('Set-Cookie', cookie.serialize('AUTH', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30
  }));

  res.json({ success: true, user });
}
