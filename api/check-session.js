import { getSession } from './_session.js';

export default async function handler(req, res) {
  const session = getSession(req);
  
  if (!session) {
    return res.status(401).json({ 
      authenticated: false 
    });
  }
  
  return res.status(200).json({ 
    authenticated: true, 
    user: session.user 
  });
}
