import React from 'react';
import { Download, Archive, Trash2, Share2 } from 'lucide-react';

interface DocumentBulkActionsProps {
  selectedCount: number;
  onArchive: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export const DocumentBulkActions = ({
  selectedCount,
  onArchive,
  onDelete,
  onDownload,
  onShare,
}: DocumentBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedCount} {selectedCount === 1 ? 'document' : 'documents'} selected
          </span>
          <div className="flex space-x-4">
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onShare}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={onArchive}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 rounded-lg"
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
            <button
              onClick={onDelete}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};