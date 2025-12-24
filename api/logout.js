import { destroySession } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  destroySession(req, res);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Logout realizado com sucesso' 
  });
}
