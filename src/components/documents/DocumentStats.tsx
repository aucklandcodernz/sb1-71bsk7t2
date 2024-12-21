import React from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { FileText, Archive, Clock, AlertCircle } from 'lucide-react';

export const DocumentStats = () => {
  const documents = useDocumentStore((state) => state.documents);
  const getExpiringSoonDocuments = useDocumentStore((state) => state.getExpiringSoonDocuments);

  const stats = {
    total: documents.length,
    active: documents.filter((doc) => doc.status === 'active').length,
    archived: documents.filter((doc) => doc.status === 'archived').length,
    expiringSoon: getExpiringSoonDocuments(30).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Documents</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <FileText className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Documents</p>
            <p className="text-2xl font-bold mt-1">{stats.active}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Clock className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Archived</p>
            <p className="text-2xl font-bold mt-1">{stats.archived}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <Archive className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Expiring Soon</p>
            <p className="text-2xl font-bold mt-1">{stats.expiringSoon}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};