import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Document } from '../types';
import { addDays, isAfter, isBefore } from 'date-fns';

interface DocumentStore {
  documents: Document[];
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  archiveDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByType: (type: Document['type']) => Document[];
  getDocumentsByTag: (tag: string) => Document[];
  getExpiringSoonDocuments: (daysThreshold: number) => Document[];
  searchDocuments: (query: string) => Document[];
}

// Initial test data
const INITIAL_DOCUMENTS: Document[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'contract',
    name: 'Employment Agreement - John Smith',
    dateUploaded: '2024-01-15',
    status: 'active',
    tags: ['contract', 'employment', 'legal'],
    expiryDate: null,
    requiredBy: null,
    size: 245760, // 240 KB
    contentType: 'application/pdf',
    version: 1,
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    employeeId: 'system',
    type: 'policy',
    name: 'Health & Safety Policy 2024',
    dateUploaded: '2024-01-01',
    status: 'active',
    tags: ['policy', 'health-safety', 'compliance'],
    expiryDate: '2024-12-31',
    requiredBy: null,
    size: 512000, // 500 KB
    contentType: 'application/pdf',
    version: 2,
    lastModified: '2024-01-01',
  },
  {
    id: '3',
    employeeId: '2',
    type: 'certification',
    name: 'First Aid Certificate - Sarah Wilson',
    dateUploaded: '2024-02-15',
    status: 'active',
    tags: ['certification', 'health-safety', 'training'],
    expiryDate: '2025-02-15',
    requiredBy: '2024-03-31',
    size: 153600, // 150 KB
    contentType: 'application/pdf',
    version: 1,
    lastModified: '2024-02-15',
  },
  {
    id: '4',
    employeeId: 'system',
    type: 'policy',
    name: 'Privacy Policy',
    dateUploaded: '2024-01-01',
    status: 'active',
    tags: ['policy', 'privacy', 'compliance'],
    expiryDate: '2024-12-31',
    requiredBy: null,
    size: 307200, // 300 KB
    contentType: 'application/pdf',
    version: 1,
    lastModified: '2024-01-01',
  },
  {
    id: '5',
    employeeId: 'system',
    type: 'policy',
    name: 'Employee Handbook 2024',
    dateUploaded: '2024-01-01',
    status: 'active',
    tags: ['policy', 'handbook', 'hr'],
    expiryDate: '2024-12-31',
    requiredBy: null,
    size: 1048576, // 1 MB
    contentType: 'application/pdf',
    version: 1,
    lastModified: '2024-01-01',
  },
];

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCUMENTS,
      
      addDocument: (document) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          documents: [...state.documents, { ...document, id }],
        }));
      },
      
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  ...updates,
                  version: (doc.version || 1) + 1,
                  lastModified: new Date().toISOString(),
                }
              : doc
          ),
        })),
      
      archiveDocument: (id) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  status: 'archived',
                  lastModified: new Date().toISOString(),
                }
              : doc
          ),
        })),
      
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),
      
      getDocumentsByType: (type) => {
        return get().documents.filter((doc) => doc.type === type);
      },
      
      getDocumentsByTag: (tag) => {
        return get().documents.filter((doc) => doc.tags.includes(tag));
      },
      
      getExpiringSoonDocuments: (daysThreshold) => {
        const now = new Date();
        const threshold = addDays(now, daysThreshold);
        
        return get().documents.filter((doc) => {
          if (!doc.expiryDate) return false;
          const expiryDate = new Date(doc.expiryDate);
          return isAfter(expiryDate, now) && isBefore(expiryDate, threshold);
        });
      },
      
      searchDocuments: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().documents.filter((doc) =>
          doc.name.toLowerCase().includes(lowercaseQuery) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
        );
      },
    }),
    {
      name: 'document-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            documents: persistedState.documents || INITIAL_DOCUMENTS,
          };
        }
        return persistedState;
      },
    }
  )
);