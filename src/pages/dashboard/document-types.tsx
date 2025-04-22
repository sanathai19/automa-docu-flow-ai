import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Upload } from "lucide-react";
import { AddDocumentTypeDialog } from "@/components/document-type/AddDocumentTypeDialog";

interface DocumentType {
  id: string;
  title: string;
  created_at: string;
  document_stats: {
    total: number;
    pending: number;
    approved: number;
  };
}

export default function DocumentTypesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const { data: types, error } = await supabase
        .from("document_types")
        .select(`
          id,
          title,
          created_at,
          documents!left (
            id,
            status
          )
        `);

      if (error) throw error;

      return types.map(type => ({
        id: type.id,
        title: type.title,
        created_at: type.created_at,
        document_stats: {
          total: type.documents?.length || 0,
          pending: type.documents?.filter(d => d.status === "pending").length || 0,
          approved: type.documents?.filter(d => d.status === "approved").length || 0
        }
      })) as DocumentType[];
    },
  });

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
                        <p className="text-muted-foreground">Total Files</p>
                        <p className="text-2xl font-bold">{type.document_stats.total}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending Review</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {type.document_stats.pending}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">
                          {type.document_stats.approved}
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

        <AddDocumentTypeDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
}
