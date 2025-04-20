
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const documentTypeId = searchParams.get("type");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: documentType } = useQuery({
    queryKey: ["documentType", documentTypeId],
    queryFn: async () => {
      if (!documentTypeId) return null;
      
      const { data, error } = await supabase
        .from("document_types")
        .select("id, title")
        .eq("id", documentTypeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!documentTypeId,
  });

  const uploadFiles = async () => {
    if (!user || !documentTypeId) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const filePath = `${user.id}/${documentTypeId}/${file.name}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create document record
        const { error: insertError } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            document_type_id: documentTypeId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
          });

        if (insertError) throw insertError;
      }

      toast.success(`${files.length} files uploaded successfully`);
      navigate("/dashboard/all-documents");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleBrowseClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (!documentTypeId) {
      toast.error("Please select a document type");
      return;
    }

    uploadFiles();
  };

  if (!documentTypeId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            Please select a document type first
          </h2>
          <Button
            onClick={() => navigate("/dashboard/document-types")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Go to Document Types
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
            {documentType && (
              <p className="text-muted-foreground mt-1">
                Type: {documentType.title}
              </p>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                Drag and drop your files here
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse from your computer
              </p>
              <Button 
                variant="outline" 
                onClick={handleBrowseClick}
              >
                Browse Files
              </Button>
              <input 
                id="file-upload"
                type="file" 
                multiple 
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                  }
                }}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Selected Files</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-4">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {files.length} {files.length === 1 ? 'file' : 'files'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
