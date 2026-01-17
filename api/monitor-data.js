import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
  // 1️⃣ Lê cookie
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.AUTH;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // 2️⃣ Valida JWT
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  // 3️⃣ Se autenticado, retorna os dados
  try {
    const filePath = path.join(
      process.cwd(),
      'data',
      'monitor-data.json'
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Arquivo monitor-data.json não encontrado'
      });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');

    // 🔹 Trata como LOG (não JSON puro)
    const entries = raw
      .split(/\n\s*,\s*\n/) // separa objetos
      .map(chunk => {
        try {
          return JSON.parse(chunk);
        } catch {
          return null; // ignora entradas quebradas
        }
      })
      .filter(Boolean);

    return res.status(200).json({
      total: entries.length,
      results: entries
    });

  } catch (err) {
    console.error('Erro monitor-data:', err);
    return res.status(500).json({
      error: 'Erro ao processar monitor-data.json'
    });
  }
}
