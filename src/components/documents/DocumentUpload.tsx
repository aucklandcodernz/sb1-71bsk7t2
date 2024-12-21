import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import toast from 'react-hot-toast';
import Select from 'react-select';

export const DocumentUpload = () => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    type: 'other' as const,
    tags: [] as string[],
    expiryDate: '',
    requiredBy: '',
  });
  
  const addDocument = useDocumentStore((state) => state.addDocument);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadError(null);

    try {
      for (const file of acceptedFiles) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('File size exceeds 10MB limit');
        }

        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        addDocument({
          name: file.name,
          type: metadata.type,
          dateUploaded: new Date().toISOString(),
          status: 'active',
          employeeId: 'system',
          tags: metadata.tags,
          expiryDate: metadata.expiryDate || null,
          requiredBy: metadata.requiredBy || null,
          size: file.size,
          contentType: file.type,
        });

        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [addDocument, metadata]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 5,
  });

  const handleTagInput = (selectedOptions: any) => {
    setMetadata(prev => ({
      ...prev,
      tags: selectedOptions.map((option: any) => option.value)
    }));
  };

  const tagOptions = [
    { value: 'contract', label: 'Contract' },
    { value: 'policy', label: 'Policy' },
    { value: 'certification', label: 'Certification' },
    { value: 'hr', label: 'HR' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'health-safety', label: 'Health & Safety' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={metadata.type}
              onChange={(e) => setMetadata(prev => ({ ...prev, type: e.target.value as any }))}
              className="input-field"
            >
              <option value="contract">Contract</option>
              <option value="policy">Policy</option>
              <option value="certification">Certification</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Select
              isMulti
              options={tagOptions}
              onChange={handleTagInput}
              className="react-select"
              placeholder="Select or type to create tags"
              classNamePrefix="react-select"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (if applicable)
            </label>
            <input
              type="date"
              value={metadata.expiryDate}
              onChange={(e) => setMetadata(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required By (if applicable)
            </label>
            <input
              type="date"
              value={metadata.requiredBy}
              onChange={(e) => setMetadata(prev => ({ ...prev, requiredBy: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors h-full flex flex-col items-center justify-center ${
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files or click to upload'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </p>
              </>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-800">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <p className="text-sm">{uploadError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};