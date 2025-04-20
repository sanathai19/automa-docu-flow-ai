
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Edit, MoreVertical, Eye, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentType {
  id: string;
  title: string;
  created_at: string;
  documents: {
    status: "pending" | "approved" | "rejected";
  }[];
}

export default function DocumentTypesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTypeTitle, setNewTypeTitle] = useState("");

  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_types")
        .select(`
          id,
          title,
          created_at,
          documents (
            status
          )
        `);

      if (error) throw error;
      return data as DocumentType[];
    },
  });

  const createDocumentType = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from("document_types")
        .insert({ title, user_id: user?.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
      setIsAddDialogOpen(false);
      setNewTypeTitle("");
      toast.success("Document type created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create document type");
      console.error("Error creating document type:", error);
    },
  });

  const handleCreate = () => {
    if (!newTypeTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    createDocumentType.mutate(newTypeTitle);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
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
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/upload?type=${type.id}`)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
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
                        <p className="text-2xl font-bold">{type.documents?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {type.documents?.filter(d => d.status === "pending").length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">
                          {type.documents?.filter(d => d.status === "approved").length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => navigate(`/dashboard/upload?type=${type.id}`)}
                  >
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document Type</DialogTitle>
            <DialogDescription>
              Create a new document type to organize your uploads.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTypeTitle}
                onChange={(e) => setNewTypeTitle(e.target.value)}
                placeholder="Enter document type title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={createDocumentType.isPending}
            >
              {createDocumentType.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
