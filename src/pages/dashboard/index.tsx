
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Edit, MoreVertical } from "lucide-react";

interface DocumentTypeCard {
  title: string;
  uploaded: number;
  pending: number;
  approved: number;
}

const documentTypes: DocumentTypeCard[] = [
  {
    title: "Invoices",
    uploaded: 124,
    pending: 12,
    approved: 112,
  },
  {
    title: "Registration Forms",
    uploaded: 85,
    pending: 5,
    approved: 80,
  },
  {
    title: "Onboarding Documents",
    uploaded: 67,
    pending: 8,
    approved: 59,
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <FileText className="mr-2 h-4 w-4" />
            Add Document Type
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((type) => (
            <Card key={type.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {type.title}
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
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
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Fields
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
