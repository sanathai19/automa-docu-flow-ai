
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUp, Plus } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleCreate = () => {
    if (!selectedDocType) {
      toast.error("Please select a document type");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsDialogOpen(false);
      toast.success(`Document type "${selectedDocType}" created successfully`);
      navigate("/dashboard/document-types");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Automa</h1>
          <p className="text-muted-foreground max-w-md">
            Start automating your document processing by adding a document type
          </p>
        </div>
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Document Type
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Document Type</DialogTitle>
            <DialogDescription>
              Select a document type and upload files to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type</Label>
              <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="onboarding">Onboarding Forms</SelectItem>
                  <SelectItem value="registration">Registration Forms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileUp className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
                <input 
                  id="file-upload"
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Back
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isUploading}
            >
              {isUploading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
