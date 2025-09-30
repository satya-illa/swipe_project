import React, { useState, useEffect } from 'react';
import { getAllPDFs } from './indexedDb';

export default function PdfList() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const stored = await getAllPDFs();
      setPdfs(stored);
    };
    load();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Stored PDFs</h3>
      {pdfs.length === 0 ? (
        <p className="text-gray-500">No PDFs saved yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {pdfs.map((pdf) => (
            <li key={pdf.id} className="mb-1">
              <a
                href={URL.createObjectURL(pdf.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                PDF {pdf.id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
