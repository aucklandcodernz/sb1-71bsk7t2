import React, { useState, useEffect } from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { FileText, ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';

interface DocumentViewerProps {
  documentId: string;
  onClose: () => void;
}

export const DocumentViewer = ({ documentId, onClose }: DocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  
  const document = useDocumentStore((state) => 
    state.documents.find(doc => doc.id === documentId)
  );

  const handleDownload = () => {
    // In a real app, this would download the actual file
    console.log('Downloading document:', document?.name);
  };

  const handlePrint = () => {
    // In a real app, this would print the document
    console.log('Printing document:', document?.name);
  };

  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{document.name}</h2>
            <p className="text-sm text-gray-500">
              Version {document.version} • Last modified {new Date(document.lastModified || '').toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="min-h-full bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <FileText size={48} className="text-gray-400" />
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm">
              Page {currentPage} of {numPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
              disabled={currentPage === numPages}
              className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Zoom:</span>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={0.5}>50%</option>
              <option value={0.75}>75%</option>
              <option value={1}>100%</option>
              <option value={1.25}>125%</option>
              <option value={1.5}>150%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};