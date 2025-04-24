
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { DocumentTypeCard } from "@/components/document-types/DocumentTypeCard";
import { UploadDialog } from "@/components/document-types/UploadDialog";

interface DocumentTypeCard {
  id: string;
  title: string;
  uploaded: number;
  pending: number;
  approved: number;
}

export default function DocumentTypesPage() {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);
  
  // Mock data - in a real app this would come from an API
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeCard[]>([
    {
      id: "invoices",
      title: "Invoices",
      uploaded: 124,
      pending: 12,
      approved: 112,
    },
    {
      id: "onboarding",
      title: "Onboarding Forms",
      uploaded: 67,
      pending: 8,
      approved: 59,
    },
    {
      id: "registration",
      title: "Registration Forms",
      uploaded: 85,
      pending: 5,
      approved: 80,
    },
  ]);

  const handleUpload = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadDialogOpen(false);
      
      // Update the document type with new files
      if (activeDocType) {
        setDocumentTypes(prev => 
          prev.map(type => 
            type.id === activeDocType
              ? { 
                  ...type, 
                  uploaded: type.uploaded + selectedFiles.length,
                  pending: type.pending + selectedFiles.length
                }
              : type
          )
        );
      }
      
      toast.success(`${selectedFiles.length} files uploaded successfully`);
      
      // Redirect to review page
      if (activeDocType) {
        navigate(`/dashboard/review/${activeDocType}`);
      }
    }, 1500);
  };

  const handleEditFields = (docTypeId: string) => {
    // This would navigate to a template editor in a real app
    toast.info("Field editor not implemented in the MVP");
  };

  const handleDelete = (docTypeId: string) => {
    setDocumentTypes(prev => prev.filter(type => type.id !== docTypeId));
    toast.success("Document type deleted successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Add Document Type
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((type) => (
            <DocumentTypeCard
              key={type.id}
              {...type}
              onEditFields={handleEditFields}
              onUpload={(id) => {
                setActiveDocType(id);
                setUploadDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </DashboardLayout>
  );
}
