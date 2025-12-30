import bcrypt from 'bcryptjs';

/**
 * Handler de login
 * Espera receber: { password }
 */
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Senha não informada' });
    }

    // Hash armazenado na Vercel (Environment Variable)
    const storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!storedHash) {
      return res.status(500).json({
        error: 'ADMIN_PASSWORD_HASH não configurado no ambiente'
      });
    }

    // Comparação bcrypt
    const isValid = await bcrypt.compare(password, storedHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
