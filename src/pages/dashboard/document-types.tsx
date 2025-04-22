
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DocumentTypeCard {
  id: string;
  title: string;
  uploaded: number;
  pending: number;
  approved: number;
}

export default function AddDocumentTypePage() {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      
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
    }, 1500);
  };

  const openUploadDialog = (docTypeId: string) => {
    setActiveDocType(docTypeId);
    setUploadDialogOpen(true);
  };

  const handleReview = (docTypeId: string) => {
    navigate(`/dashboard/review/${docTypeId}`);
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
            <Card key={type.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {type.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditFields(type.id)}>
                      Edit Fields
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openUploadDialog(type.id)}>
                      Upload Files
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(type.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Uploaded</p>
                        <p className="text-2xl font-bold">{type.uploaded}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{type.pending}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{type.approved}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleEditFields(type.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Fields
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => openUploadDialog(type.id)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleReview(type.id)}
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload files for processing with Automa's intelligent extraction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-purple-500", "bg-purple-50");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-purple-500", "bg-purple-50");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-purple-500", "bg-purple-50");
                  if (e.dataTransfer.files) {
                    setSelectedFiles(Array.from(e.dataTransfer.files));
                  }
                }}
              >
                <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload-dialog')?.click()}
                >
                  Browse Files
                </Button>
                <input 
                  id="file-upload-dialog"
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div>
                <Label>Selected Files</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="text-sm bg-muted p-2 rounded flex justify-between items-center"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Back
            </Button>
            <Button 
              onClick={handleUpload} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
