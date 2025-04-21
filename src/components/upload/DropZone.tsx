
import { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

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
    onFilesAdded(droppedFiles);
  };

  const handleBrowseClick = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center",
        isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300"
      )}
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
            onFilesAdded(Array.from(e.target.files));
          }
        }}
      />
    </div>
  );
}
