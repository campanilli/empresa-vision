import { getSession } from './_session.js';

export default function handler(req, res) {
  const session = getSession(req);
  if (!session) return res.redirect('/login.html');

  res.setHeader('Content-Type', 'text/html');
  res.end(`<h1>Dashboard</h1><p>Bem-vindo, ${session.user}</p><a href="/api/logout">Logout</a>`);
}