import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';

const USER = 'admin';

// HASH gerado previamente
const PASSWORD_HASH = '$2a$12$K6z1s9Y5ZpZ4e5X7xqz3XuGZk0n1xP0z3E0Zz4pL8pV1yN1R7S9tO';

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
