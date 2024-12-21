import React, { useState } from 'react';
import { FileText, Download, Archive, ExternalLink, Search, Tag, Calendar, AlertCircle } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { DocumentViewer } from './DocumentViewer';
import Select from 'react-select';
import toast from 'react-hot-toast';

export const DocumentList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  const {
    documents,
    archiveDocument,
    searchDocuments,
    getDocumentsByType,
    getDocumentsByTag,
  } = useDocumentStore();

  const filteredDocuments = React.useMemo(() => {
    let result = documents;
    
    if (selectedType !== 'all') {
      result = getDocumentsByType(selectedType);
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(doc => 
        selectedTags.every(tag => doc.tags.includes(tag))
      );
    }
    
    if (searchQuery) {
      result = searchDocuments(searchQuery);
    }
    
    return result;
  }, [documents, selectedType, selectedTags, searchQuery]);

  const handleArchive = (id: string) => {
    if (confirm('Are you sure you want to archive this document?')) {
      archiveDocument(id);
      toast.success('Document archived successfully');
    }
  };

  const handleDownload = (doc: any) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading ${doc.name}`);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="text-blue-600" />;
      case 'policy':
        return <FileText className="text-green-600" />;
      case 'certification':
        return <FileText className="text-yellow-600" />;
      default:
        return <FileText className="text-gray-600" />;
    }
  };

  const isExpiringSoon = (doc: any) => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    const now = new Date();
    return isAfter(expiryDate, now) && isBefore(expiryDate, addDays(now, 30));
  };

  const tagOptions = Array.from(
    new Set(documents.flatMap(doc => doc.tags))
  ).map(tag => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1)
  }));

  return (
    <>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="contract">Contracts</option>
          <option value="policy">Policies</option>
          <option value="certification">Certifications</option>
          <option value="other">Other</option>
        </select>

        <Select
          isMulti
          options={tagOptions}
          onChange={(selected) => setSelectedTags(selected.map(option => option.value))}
          className="react-select"
          placeholder="Filter by tags"
          classNamePrefix="react-select"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              {getDocumentIcon(doc.type)}
              <span className={`px-2 py-1 rounded-full text-xs ${
                doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {doc.status.toUpperCase()}
              </span>
            </div>
            
            <h3 className="mt-3 font-medium truncate">{doc.name}</h3>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <p className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Added: {format(new Date(doc.dateUploaded), 'MMM d, yyyy')}
              </p>
              {doc.expiryDate && (
                <p className="flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  Expires: {format(new Date(doc.expiryDate), 'MMM d, yyyy')}
                  {isExpiringSoon(doc) && (
                    <span className="ml-2 text-red-600">(Expiring soon)</span>
                  )}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDocument(doc.id)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="View"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
              {doc.status === 'active' && (
                <button
                  onClick={() => handleArchive(doc.id)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Archive"
                >
                  <Archive size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found. Upload some documents to get started.
        </div>
      )}

      {selectedDocument && (
        <DocumentViewer
          documentId={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
};