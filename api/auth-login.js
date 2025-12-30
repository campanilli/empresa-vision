import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import crypto from 'crypto';

function decrypt(encrypted) {
  const algorithm = 'aes-256-cbc';
  const key = crypto
    .createHash('sha256')
    .update(process.env.ADMIN_SECRET_KEY)
    .digest();

  const iv = Buffer.from(encrypted.slice(0, 32), 'hex');
  const content = Buffer.from(encrypted.slice(32), 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(content);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  const realPassword = decrypt(process.env.ADMIN_PASSWORD_ENC);

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
