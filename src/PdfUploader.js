// src/components/PdfUploader.js
import React, { useState, useEffect } from 'react';
import { savePDF, getAllPDFs } from './indexedDb';

export default function PdfUploader() {
  const [pdfs, setPdfs] = useState([]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      await savePDF(file);
      loadPdfs();
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const loadPdfs = async () => {
    const stored = await getAllPDFs();
    setPdfs(stored);
  };

  useEffect(() => {
    loadPdfs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Upload PDF and Save to IndexedDB</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} />

      <h3 className="mt-4 font-bold">Stored PDFs:</h3>
      <ul>
        {pdfs.map((pdf, idx) => (
          <li key={idx}>
            <a
              href={URL.createObjectURL(pdf.file)}
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF {pdf.id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

