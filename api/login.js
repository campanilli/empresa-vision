import { createSession } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user, pass } = req.body;
  if (user === 'admin' && pass === '123') {
    createSession(res, user);
    return res.redirect('/dashboard');
  }

  res.redirect('/login.html?error=1');
}