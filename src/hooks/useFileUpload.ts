
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useFileUpload = (documentTypeId: string | null) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const createUploadLog = async (documentId: string, status: string, errorMessage?: string) => {
    const { error } = await supabase
      .from("upload_logs")
      .insert({
        user_id: user?.id,
        document_id: documentId,
        status,
        error_message: errorMessage
      });

    if (error) {
      console.error("Failed to create upload log:", error);
    }
  };

  const uploadFiles = async () => {
    if (!user || !documentTypeId) return;

    setIsUploading(true);
    const results = { success: 0, failed: 0 };
    
    try {
      for (const file of files) {
        try {
          const filePath = `${user.id}/${documentTypeId}/${file.name}`;
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
          
          const { error: uploadError } = await supabase.storage
            .from("documents")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: document, error: insertError } = await supabase
            .from("documents")
            .insert({
              user_id: user.id,
              document_type_id: documentTypeId,
              file_path: filePath,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          await createUploadLog(document.id, 'success');
          results.success++;
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        } catch (error) {
          console.error("Upload error for file", file.name, ":", error);
          results.failed++;
          await createUploadLog(file.name, 'failed', error.message);
        }
      }

      toast.success(`Upload complete: ${results.success} succeeded, ${results.failed} failed`);
      navigate("/dashboard/all-documents");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
      setFiles([]);
      setUploadProgress({});
    }
  };

  return {
    files,
    setFiles,
    isUploading,
    uploadProgress,
    uploadFiles
  };
};
