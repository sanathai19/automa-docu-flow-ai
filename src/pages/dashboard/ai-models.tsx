
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw } from "lucide-react";

export default function AiModelsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2 bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                Active
              </Badge>
              <CardTitle>Invoice Processor</CardTitle>
              <CardDescription>
                Extract data from invoices with high accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "94%" }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Documents Processed</span>
                  <span className="text-sm font-medium">2,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">4 days ago</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retrain Model
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2 bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                Active
              </Badge>
              <CardTitle>Registration Form Extractor</CardTitle>
              <CardDescription>
                Extract form fields from registration documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium">91%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "91%" }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Documents Processed</span>
                  <span className="text-sm font-medium">1,873</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">1 week ago</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retrain Model
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
                Training
              </Badge>
              <CardTitle>Onboarding Document Analyzer</CardTitle>
              <CardDescription>
                Extract data from employee onboarding forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Training Progress</span>
                  <span className="text-sm font-medium">67%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "67%" }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Training Documents</span>
                  <span className="text-sm font-medium">523</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Completion</span>
                  <span className="text-sm font-medium">2 hours</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                <Brain className="mr-2 h-4 w-4" />
                Training in Progress
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
