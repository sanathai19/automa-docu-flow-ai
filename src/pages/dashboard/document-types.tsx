
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Edit, MoreVertical, PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface DocumentTypeCard {
  id: string;
  name: string;
  description?: string;
  uploaded: number;
  pending: number;
  approved: number;
}

export default function AddDocumentTypePage() {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDocType, setNewDocType] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    setIsLoading(true);
    try {
      const { data: docTypes, error } = await supabase
        .from('document_types')
        .select('*');

      if (error) {
        throw error;
      }

      if (docTypes) {
        // For each document type, get the count of documents
        const docTypesWithCounts = await Promise.all(
          docTypes.map(async (docType) => {
            // Get total count
            const { count: total, error: totalError } = await supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('document_type_id', docType.id);

            // Get pending count
            const { count: pending, error: pendingError } = await supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('document_type_id', docType.id)
              .eq('status', 'pending');

            // Get approved count
            const { count: approved, error: approvedError } = await supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('document_type_id', docType.id)
              .eq('status', 'approved');

            if (totalError || pendingError || approvedError) {
              console.error("Error fetching counts", totalError || pendingError || approvedError);
            }

            return {
              id: docType.id,
              name: docType.name,
              description: docType.description,
              uploaded: total || 0,
              pending: pending || 0,
              approved: approved || 0
            };
          })
        );

        setDocumentTypes(docTypesWithCounts);
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Failed to load document types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (!activeDocType) {
      toast.error("No document type selected");
      return;
    }

    setIsUploading(true);
    
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload each file and create document records
      for (const file of selectedFiles) {
        // Upload file to storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('documents')
          .upload(`${user.id}/${fileName}`, file);

        if (fileError) {
          throw fileError;
        }

        // Create document record
        const { error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            document_type_id: activeDocType,
            status: 'pending',
            file_name: file.name,
            file_path: fileData?.path,
            file_type: file.type.split('/')[1],
            mime_type: file.type,
            file_size: file.size
          });

        if (docError) {
          throw docError;
        }
      }

      toast.success(`${selectedFiles.length} files uploaded successfully`);
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      fetchDocumentTypes(); // Refresh the list
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateDocType = async () => {
    if (!newDocType.name.trim()) {
      toast.error("Document type name is required");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('document_types')
        .insert({
          name: newDocType.name,
          description: newDocType.description,
          user_id: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      toast.success("Document type created successfully");
      setCreateDialogOpen(false);
      setNewDocType({ name: '', description: '' });
      fetchDocumentTypes(); // Refresh the list
    } catch (error) {
      console.error("Error creating document type:", error);
      toast.error("Failed to create document type");
    }
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

  const handleDelete = async (docTypeId: string) => {
    try {
      const { error } = await supabase
        .from('document_types')
        .delete()
        .eq('id', docTypeId);

      if (error) {
        throw error;
      }

      setDocumentTypes(prev => prev.filter(type => type.id !== docTypeId));
      toast.success("Document type deleted successfully");
    } catch (error) {
      console.error("Error deleting document type:", error);
      toast.error("Failed to delete document type");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Document Type
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading document types...</p>
          </div>
        ) : documentTypes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold">No document types found</h3>
            <p className="mt-1 text-gray-500">Get started by adding a document type.</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Document Type
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    {type.name}
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
                    {type.description && (
                      <p className="text-sm text-gray-500">{type.description}</p>
                    )}
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
        )}
      </div>

      {/* Upload Dialog */}
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

      {/* Create Document Type Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Document Type</DialogTitle>
            <DialogDescription>
              Create a new document type for your organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newDocType.name}
                onChange={(e) => setNewDocType({...newDocType, name: e.target.value})}
                placeholder="e.g., Invoice, Contract, Form"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={newDocType.description}
                onChange={(e) => setNewDocType({...newDocType, description: e.target.value})}
                placeholder="Describe this document type"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDocType} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
