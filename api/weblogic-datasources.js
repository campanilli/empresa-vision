import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(
      process.cwd(),
      'data',
      'weblogic-datasources.json'
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Arquivo weblogic-datasources.json não encontrado'
      });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao processar weblogic-datasources.json',
      details: err.message
    });
  }
}
