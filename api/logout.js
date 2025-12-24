import { destroySession } from './_session.js';

export default function handler(req, res) {
  destroySession(req, res);
  res.redirect('/login.html');
}