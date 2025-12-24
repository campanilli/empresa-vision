import { createSession } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { user, pass } = req.body;
  
  // Validação simples
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
