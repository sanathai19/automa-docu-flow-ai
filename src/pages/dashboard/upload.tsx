
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DropZone } from "@/components/upload/DropZone";
import { FileList } from "@/components/upload/FileList";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentTypeId = searchParams.get("type");

  const {
    files,
    setFiles,
    isUploading,
    uploadProgress,
    uploadFiles
  } = useFileUpload(documentTypeId);

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
            <DropZone onFilesAdded={files => setFiles(prev => [...prev, ...files])} />
            <FileList 
              files={files}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              onUpload={handleUpload}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
