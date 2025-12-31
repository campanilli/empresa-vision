import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import crypto from 'crypto';

// Função para criar hash SHA-256 com salt
function hashPassword(password, salt) {
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

// Função para verificar senha
function verifyPassword(password, storedHash, salt) {
  const hash = hashPassword(password, salt);
  return hash === storedHash;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { user, pass } = req.body;

  // Validação básica
  if (!user || !pass) {
    return res.status(400).json({ 
      success: false, 
      message: 'Usuário e senha são obrigatórios' 
    });
  }

  // Verifica se as variáveis de ambiente estão configuradas
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ 
      success: false, 
      message: 'Configuração do servidor incompleta' 
    });
  }

  // Verifica o usuário
  if (user !== process.env.ADMIN_USER) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário ou senha incorretos' 
    });
  }

  try {
    // Usa o JWT_SECRET como salt
    const isPasswordValid = verifyPassword(
      pass, 
      process.env.ADMIN_PASSWORD_HASH, 
      process.env.JWT_SECRET
    );

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário ou senha incorretos' 
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    // Define o cookie
    res.setHeader('Set-Cookie', cookie.serialize('AUTH', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30 // 30 minutos
    }));

    return res.json({ success: true, user });

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar autenticação' 
    });
  }
}