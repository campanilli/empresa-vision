import { createSession } from './_session.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { user, pass } = req.body;
  
  if (user === 'admin' && pass === '123') {
    createSession(res, user);
    return res.status(200).json({ 
      success: true, 
      message: 'Login realizado com sucesso',
      user 
    });
  }
  
  return res.status(401).json({ 
    success: false, 
    message: 'Credenciais inválidas' 
  });
}