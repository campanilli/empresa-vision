import cookie from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('AUTH', '', {
    path: '/',
    maxAge: 0
  }));

  res.json({ success: true });
}
