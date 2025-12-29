import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';

const USER = 'admin';

// HASH gerado previamente
const PASSWORD_HASH = '$2a$12$2UlD1brv4CiQWT7STHcM4OZmxqsKh.oztMjzx4e/1p/HdTE7fRBdm';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  if (user !== USER || !bcrypt.compareSync(pass, PASSWORD_HASH)) {
    return res.status(401).json({
      success: false,
      message: 'Usuário ou senha inválidos'
    });
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
