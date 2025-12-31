import { verify } from '@node-rs/bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  console.log('=== AUTH LOGIN DEBUG ===');
  console.log('Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    });
  }

  const { user, pass } = req.body;
  console.log('Usuário recebido:', user);
  console.log('Senha recebida (length):', pass?.length);

  // Validação básica
  if (!user || !pass) {
    console.log('❌ Usuário ou senha vazio');
    return res.status(400).json({ 
      success: false, 
      message: 'Usuário e senha são obrigatórios' 
    });
  }

  // Verifica se as variáveis de ambiente estão configuradas
  console.log('ADMIN_USER definido:', !!process.env.ADMIN_USER);
  console.log('ADMIN_PASSWORD_HASH definido:', !!process.env.ADMIN_PASSWORD_HASH);
  console.log('ADMIN_PASSWORD_HASH (primeiros chars):', process.env.ADMIN_PASSWORD_HASH?.substring(0, 10));
  
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD_HASH) {
    console.error('❌ Variáveis de ambiente não configuradas');
    return res.status(500).json({ 
      success: false, 
      message: 'Configuração do servidor incompleta' 
    });
  }

  // Verifica o usuário
  if (user !== process.env.ADMIN_USER) {
    console.log('❌ Usuário incorreto');
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário ou senha incorretos' 
    });
  }

  console.log('✅ Usuário correto, verificando senha...');

  try {
    // Compara a senha fornecida com o hash bcrypt armazenado
    console.log('Iniciando verify...');
    const isPasswordValid = await verify(pass, process.env.ADMIN_PASSWORD_HASH);
    console.log('Resultado verify:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário ou senha incorretos' 
      });
    }

    console.log('✅ Senha correta! Gerando token...');

    // Gera o token JWT
    const token = jwt.sign(
      { user, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    console.log('✅ Token gerado');

    // Define o cookie com configurações seguras
    res.setHeader('Set-Cookie', cookie.serialize('AUTH', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30 // 30 minutos
    }));

    console.log('✅ Login bem-sucedido!');
    return res.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    console.error('Tipo de erro:', error.name);
    console.error('Mensagem:', error.message);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar autenticação: ' + error.message 
    });
  }
}