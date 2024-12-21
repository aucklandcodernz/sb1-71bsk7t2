import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentList } from '../components/documents/DocumentList';
import { DocumentStats } from '../components/documents/DocumentStats';
import { DocumentCategories } from '../components/documents/DocumentCategories';
import { DocumentTemplates } from '../components/documents/DocumentTemplates';
import { DocumentBulkActions } from '../components/documents/DocumentBulkActions';

const Documents = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'templates'>('all');

  const handleBulkArchive = () => {
    // Handle bulk archive
    console.log('Archiving documents:', selectedDocuments);
  };

  const handleBulkDelete = () => {
    // Handle bulk delete
    console.log('Deleting documents:', selectedDocuments);
  };

  const handleBulkDownload = () => {
    // Handle bulk download
    console.log('Downloading documents:', selectedDocuments);
  };

  const handleBulkShare = () => {
    // Handle bulk share
    console.log('Sharing documents:', selectedDocuments);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Manage company documents and policies</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      <DocumentStats />
      <DocumentCategories />

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'templates'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {activeTab === 'all' ? (
        <>
          {showUpload && (
            <div className="mb-8">
              <DocumentUpload onClose={() => setShowUpload(false)} />
            </div>
          )}
          <DocumentList
            onSelectionChange={setSelectedDocuments}
          />
        </>
      ) : (
        <DocumentTemplates />
      )}

      <DocumentBulkActions
        selectedCount={selectedDocuments.length}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
        onDownload={handleBulkDownload}
        onShare={handleBulkShare}
      />
    </div>
  );
};

export default Documents;