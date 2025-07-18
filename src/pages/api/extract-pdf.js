// pages/api/extract-pdf.js
import formidable from 'formidable';
import fs from 'fs';
import { PDFExtract } from 'pdf.js-extract';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form' });
    }
    
    let pdfFile = files.file;
    // Handle if files.file is an array (formidable v3+ can return array for multiple files)
    if (Array.isArray(pdfFile)) {
      pdfFile = pdfFile[0];
    }
    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    try {
      const pdfExtract = new PDFExtract();
      const data = await pdfExtract.extract(pdfFile.filepath);
      
      // Extract text from pages
      const text = data.pages
        .map(page => page.content.map(item => item.str).join(' '))
        .join('\n\n');
        
      return res.status(200).json({ text });
    } catch (error) {
      console.error('Error extracting PDF:', error);
      return res.status(500).json({ error: 'Error extracting PDF content' });
    }
  });
}