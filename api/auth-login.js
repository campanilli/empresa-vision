import jwt from 'jsonwebtoken';
import cookie from 'cookie';

function decodeBase64(encoded) {
  if (!encoded) return null;
  return Buffer.from(encoded.trim(), 'base64').toString('utf-8');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  const realPassword = decodeBase64(process.env.ADMIN_PASSWORD_ENC);

  // proteção extra para debug
  if (!realPassword) {
    return res.status(500).json({ error: 'Senha não configurada no ambiente' });
  }

  if (user !== 'admin' || pass !== realPassword) {
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
