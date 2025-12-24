import cookie from 'cookie';

const sessions = {};

export function createSession(res, user) {
  const id = Math.random().toString(36).substring(2) + 
             Math.random().toString(36).substring(2);
  
  sessions[id] = { 
    user, 
    expires: Date.now() + 30 * 60 * 1000 // 30 minutos
  };
  
  res.setHeader('Set-Cookie', cookie.serialize('SESSION', id, {
    httpOnly: true,
    path: '/',
    maxAge: 30 * 60, // 30 minutos
    sameSite: 'lax'
  }));
  
  return id;
}

export function getSession(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const id = cookies.SESSION;
  
  if (!id || !sessions[id]) return null;
  
  if (sessions[id].expires < Date.now()) {
    delete sessions[id];
    return null;
  }
  
  return sessions[id];
}

export function destroySession(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const id = cookies.SESSION;
  
  if (id) {
    delete sessions[id];
  }
  
  res.setHeader('Set-Cookie', cookie.serialize('SESSION', '', {
    path: '/',
    maxAge: 0
  }));
}
