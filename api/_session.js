import cookie from 'cookie';

const sessions = {};

export function createSession(res, user) {
  const id = Math.random().toString(36).substring(2);
  sessions[id] = { user, expires: Date.now() + 30 * 60 * 1000 };

  res.setHeader('Set-Cookie', cookie.serialize('SESSION', id, {
    httpOnly: true,
    path: '/',
  }));
}

export function getSession(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const id = cookies.SESSION;
  if (!id || !sessions[id]) return null;
  if (sessions[id].expires < Date.now()) return null;
  return sessions[id];
}

export function destroySession(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const id = cookies.SESSION;
  delete sessions[id];

  res.setHeader('Set-Cookie', cookie.serialize('SESSION', '', {
    path: '/',
    maxAge: 0
  }));
}