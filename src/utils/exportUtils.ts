// src/utils/exportUtils.ts

/**
 * Utility functions for exporting content to different file formats
 */

import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// Export to plain text
export function exportToText(content: string, filename: string = 'document.txt') {
  downloadFile(content, filename, 'text/plain');
}

// Export to Markdown
export function exportToMarkdown(content: string, filename: string = 'document.md') {
  // Markdown is already plain text, so we can download it directly
  downloadFile(content, filename, 'text/markdown');
}

// Export to HTML
export function exportToHTML(content: string, filename: string = 'document.html') {
  // If content is not already HTML, you might need to convert it
  downloadFile(content, filename, 'text/html');
}

// Export to DOCX (real implementation)
export function exportToDocx(content: string, filename: string = 'document.docx') {
  const paragraphs: Paragraph[] = [];
  const lines = content.split(/\n/);
  lines.forEach((line: string = '') => {
    const safeLine = line || '';
    // Heading 1
    if (/^# (.*)/.test(safeLine)) {
      paragraphs.push(new Paragraph({
        text: safeLine.replace(/^# /, '') || '',
        heading: HeadingLevel.HEADING_1,
      }));
    }
    // Heading 2
    else if (/^## (.*)/.test(safeLine)) {
      paragraphs.push(new Paragraph({
        text: safeLine.replace(/^## /, '') || '',
        heading: HeadingLevel.HEADING_2,
      }));
    }
    // List item
    else if (/^- /.test(safeLine)) {
      paragraphs.push(new Paragraph({
        children: [new TextRun(safeLine.replace(/^- /, '') || '')],
        bullet: { level: 0 },
      }));
    }
    // Bold (**text**)
    else if (/\*\*(.*?)\*\*/.test(safeLine)) {
      const runs: TextRun[] = [];
      let rest = safeLine;
      while (rest.length > 0) {
        const match = rest.match(/\*\*(.*?)\*\*/);
        if (match && match.index !== undefined) {
          // Text before bold
          if (match.index > 0) {
            runs.push(new TextRun(rest.slice(0, match.index) || ''));
          }
          // Bold text
          runs.push(new TextRun({ text: (match[1] || ''), bold: true }));
          rest = rest.slice(match.index + match[0].length) || '';
        } else {
          runs.push(new TextRun(rest || ''));
          break;
        }
      }
      paragraphs.push(new Paragraph({ children: runs }));
    }
    // Normal text
    else if ((safeLine.trim() !== '')) {
      paragraphs.push(new Paragraph({ children: [new TextRun(safeLine)] }));
    } else {
      paragraphs.push(new Paragraph(''));
    }
  });
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });
  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Export to PDF (real implementation)
export function exportToPDF(content: string, filename: string = 'document.pdf') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  let y = margin;
  const lineHeight = 18;
  const lines = content.split(/\n/);
  doc.setFont('helvetica');
  lines.forEach((line: string) => {
    // Heading 1
    if (/^# (.*)/.test(line)) {
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.text(line.replace(/^# /, ''), margin, y);
      y += lineHeight + 12;
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
    }
    // Heading 2
    else if (/^## (.*)/.test(line)) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(line.replace(/^## /, ''), margin, y);
      y += lineHeight + 6;
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
    }
    // List item
    else if (/^- /.test(line)) {
      doc.setFont(undefined, 'normal');
      doc.text('• ' + line.replace(/^- /, ''), margin + 10, y);
      y += lineHeight;
    }
    // Bold (**text**)
    else if (/\*\*(.*?)\*\*/.test(line)) {
      let cursor = margin;
      let rest = line;
      while (rest.length > 0) {
        const match = rest.match(/\*\*(.*?)\*\*/);
        if (match && match.index !== undefined) {
          // Text before bold
          if (match.index > 0) {
            const before = rest.slice(0, match.index);
            doc.setFont(undefined, 'normal');
            doc.text(before, cursor, y, { baseline: 'top' });
            cursor += doc.getTextWidth(before);
          }
          // Bold text
          doc.setFont(undefined, 'bold');
          doc.text(match[1], cursor, y, { baseline: 'top' });
          cursor += doc.getTextWidth(match[1]);
          rest = rest.slice(match.index + match[0].length);
        } else {
          // No more bold, print rest
          doc.setFont(undefined, 'normal');
          doc.text(rest, cursor, y, { baseline: 'top' });
          break;
        }
      }
      y += lineHeight + 4;
      doc.setFont(undefined, 'normal');
    }
    // Normal text
    else if (line.trim() !== '') {
      doc.setFont(undefined, 'normal');
      const wrapped = doc.splitTextToSize(line, 500);
      wrapped.forEach((wline: string) => {
        doc.text(wline, margin, y);
        y += lineHeight;
      });
    } else {
      y += lineHeight / 2;
    }
    if (y > 800) { doc.addPage(); y = margin; }
  });
  doc.save(filename);
}

// Helper function to trigger download
function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to download any blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}