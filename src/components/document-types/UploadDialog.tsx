
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

export function UploadDialog({ 
  open, 
  onOpenChange, 
  onUpload,
  isUploading 
}: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
