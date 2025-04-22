
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocumentTypes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setDocumentTypes(data || []);
    } catch (err) {
      console.error('Error fetching document types:', err);
      setError(err as Error);
      toast.error('Failed to load document types');
    } finally {
      setIsLoading(false);
    }
  };

  const createDocumentType = async (name: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('document_types')
        .insert({
          name,
          description,
          user_id: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Document type created successfully');
      return data[0];
    } catch (err) {
      console.error('Error creating document type:', err);
      toast.error('Failed to create document type');
      throw err;
    }
  };

  const deleteDocumentType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('document_types')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDocumentTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Document type deleted successfully');
    } catch (err) {
      console.error('Error deleting document type:', err);
      toast.error('Failed to delete document type');
      throw err;
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return {
    documentTypes,
    isLoading,
    error,
    fetchDocumentTypes,
    createDocumentType,
    deleteDocumentType
  };
};
