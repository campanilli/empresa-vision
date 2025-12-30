import jwt from 'jsonwebtoken';
import cookie from 'cookie';

/**
 * Decodifica Base64
 */
function decodeBase64(encoded) {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  // senha real obtida a partir do Base64
  const realPassword = decodeBase64(process.env.ADMIN_PASSWORD_ENC);

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
