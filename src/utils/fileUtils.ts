// src/utils/fileUtils.ts (updated version)

/**
 * Utility functions for handling file uploads and parsing different file formats
 */
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';

/**
 * Reads and processes different file types
 * @param file File object from input element
 * @returns Parsed content as string or object
 */
export async function parseFile(file: File) {
  const fileType = getFileType(file);
  
  switch (fileType) {
    case 'text':
    case 'markdown':
    case 'html':
      return readTextFile(file);
      
    case 'csv':
      return readCSVFile(file);
      
    case 'excel':
      return readExcelFile(file);
      
    case 'docx':
      return readDocxFile(file);
      
    case 'pdf':
      return readPDFFile(file);
      
    default:
      throw new Error('Unsupported file type');
  }
}

// Helper function to determine file type
function getFileType(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'unknown';
  
  switch (extension) {
    case 'txt': return 'text';
    case 'md': return 'markdown';
    case 'html': return 'html';
    case 'csv': return 'csv';
    case 'xlsx':
    case 'xls': return 'excel';
    case 'docx': return 'docx';
    case 'pdf': return 'pdf';
    default: return 'unknown';
  }
}

// Text-based files (txt, md, html)
async function readTextFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// CSV files
async function readCSVFile(file: File) {
  const text = await readTextFile(file);
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

// Excel files
async function readExcelFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
}

// DOCX files
async function readDocxFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
}

// Update the readPDFFile function in src/utils/fileUtils.ts

async function readPDFFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract PDF content');
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error extracting PDF:', error);
      throw new Error('Failed to process PDF file');
    }
}