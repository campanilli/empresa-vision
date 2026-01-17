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

    // 🔹 Lê o arquivo JSON diretamente
    const rawData = fs.readFileSync(filePath, 'utf-8');
    
    // 🔹 Faz o parse do JSON
    let data;
    try {
      data = JSON.parse(rawData);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError.message);
      return res.status(500).json({
        error: 'Arquivo JSON inválido',
        details: parseError.message
      });
    }

    // 🔹 Valida se o JSON tem a estrutura esperada
    if (!data.Results || !Array.isArray(data.Results)) {
      console.error('Estrutura do JSON inválida - falta campo Results');
      return res.status(500).json({
        error: 'Estrutura do arquivo JSON inválida',
        details: 'Campo "Results" ausente ou não é um array'
      });
    }

    // 🔹 Retorna o objeto JSON completo (não um array)
    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro ao processar monitor-data.json:', err);
    return res.status(500).json({
      error: 'Erro ao processar monitor-data.json',
      details: err.message
    });
  }
}