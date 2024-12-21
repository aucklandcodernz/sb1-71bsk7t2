import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { AlertCircle, Plus, X, FileText, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface DocumentsFormProps {
  employeeId: string;
  onClose: () => void;
}

export const DocumentsForm = ({ employeeId, onClose }: DocumentsFormProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [documents, setDocuments] = useState(employee?.documents || []);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5242880, // 5MB
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      try {
        const newDocuments = acceptedFiles.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'other' as const,
          name: file.name,
          dateUploaded: new Date().toISOString(),
          status: 'active' as const,
          fileUrl: URL.createObjectURL(file),
          size: file.size,
          contentType: file.type
        }));

        setDocuments([...documents, ...newDocuments]);
        toast.success('Documents uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload documents');
      } finally {
        setUploading(false);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployee(employeeId, { documents });
      toast.success('Documents updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update documents');
    }
  };

  const updateDocument = (id: string, field: string, value: any) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDownload = (document: any) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading ${document.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6">Employee Documents</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <>
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag 'n' drop files here, or click to select files"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG up to 5MB
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="border rounded-lg p-4 relative hover:bg-gray-50"
            >
              <button
                type="button"
                onClick={() => removeDocument(document.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Document Type
                  </label>
                  <select
                    value={document.type}
                    onChange={(e) => updateDocument(document.id, 'type', e.target.value)}
                    className="input-field"
                  >
                    <option value="contract">Employment Contract</option>
                    <option value="visa">Visa Document</option>
                    <option value="passport">Passport</option>
                    <option value="certification">Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={document.name}
                    onChange={(e) => updateDocument(document.id, 'name', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Date
                  </label>
                  <div className="text-sm text-gray-500 mt-2">
                    {format(new Date(document.dateUploaded), 'dd/MM/yyyy')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={document.expiryDate || ''}
                    onChange={(e) => updateDocument(document.id, 'expiryDate', e.target.value)}
                    className="input-field"
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="text-gray-400" size={20} />
                  <span className="text-sm text-gray-600">
                    {(document.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(document)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Document Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep copies of all employment-related documents</li>
                <li>Monitor expiry dates for visas and certifications</li>
                <li>Ensure document security and privacy</li>
                <li>Maintain records for 7 years</li>
                <li>Regular document audits recommended</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};