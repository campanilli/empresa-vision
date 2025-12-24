import { getSession } from './_session.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
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