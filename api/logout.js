import cookie from 'cookie';

export default async function handler(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('AUTH', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  }));

  res.json({
    success: true
  });
}
