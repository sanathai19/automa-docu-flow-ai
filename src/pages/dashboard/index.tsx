
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDocumentTypeDialog } from "@/components/document-type/AddDocumentTypeDialog";

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

      <AddDocumentTypeDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </DashboardLayout>
  );
}
