// src/utils/exportUtils.ts

/**
 * Utility functions for exporting content to different file formats
 */

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

// Export to DOCX (placeholder)
export function exportToDocx(content: string, filename: string = 'document.docx') {
  // This is a placeholder - for actual DOCX generation, you'll need a library
  alert('DOCX export requires additional libraries like docx.js');
}

// Export to PDF (placeholder)
export function exportToPDF(content: string, filename: string = 'document.pdf') {
  // This is a placeholder - for actual PDF generation, you'll need a library
  alert('PDF export requires additional libraries like jsPDF');
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