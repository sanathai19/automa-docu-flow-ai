
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileListProps {
  files: File[];
  uploadProgress: Record<string, number>;
  isUploading: boolean;
  onUpload: () => void;
}

export function FileList({ files, uploadProgress, isUploading, onUpload }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-3">Selected Files</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm truncate flex-1">{file.name}</span>
              <span className="text-xs text-gray-500 ml-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            {uploadProgress[file.name] > 0 && (
              <Progress value={uploadProgress[file.name]} className="h-2" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          disabled={isUploading}
          onClick={onUpload}
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
  );
}
