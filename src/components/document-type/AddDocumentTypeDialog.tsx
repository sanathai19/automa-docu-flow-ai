
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AddDocumentTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDocumentTypeDialog({ open, onOpenChange }: AddDocumentTypeDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTypeTitle, setNewTypeTitle] = useState("");

  const createDocumentType = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from("document_types")
        .insert({ title, user_id: user?.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
