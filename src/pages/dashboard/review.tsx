
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, AlertTriangle, ArrowLeft, Save, Download } from "lucide-react";
import { toast } from "sonner";

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [fields, setFields] = useState<ExtractedField[]>([
    { id: "field-1", name: "Invoice Number", value: "INV-2025-0042", confidence: 0.98 },
    { id: "field-2", name: "Date", value: "2025-04-15", confidence: 0.95 },
    { id: "field-3", name: "Vendor", value: "Acme Corporation", confidence: 0.92 },
    { id: "field-4", name: "Amount", value: "$1,250.00", confidence: 0.65 },
    { id: "field-5", name: "Tax", value: "$112.50", confidence: 0.72 },
    { id: "field-6", name: "Total", value: "$1,362.50", confidence: 0.88 },
  ]);
  
  const updateFieldValue = (id: string, newValue: string) => {
    setFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const handleSave = () => {
    toast.success("Document processed and saved successfully");
  };

  // Format the document type ID for display
  const documentTypeName = id === "invoices" 
    ? "Invoices" 
    : id === "onboarding" 
      ? "Onboarding Forms" 
      : "Registration Forms";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Review Document</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => toast.info("Download functionality not implemented in MVP")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel - Extracted Fields */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Extracted Fields</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor={field.id} 
                        className="text-sm font-medium"
                      >
                        {field.name}
                      </label>
                      {field.confidence >= 0.8 ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          High confidence
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low confidence
                        </div>
                      )}
                    </div>
                    <input
                      id={field.id}
                      type="text"
                      value={field.value}
                      onChange={(e) => updateFieldValue(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        field.confidence < 0.8 ? "border-yellow-300 bg-yellow-50" : ""
                      }`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Document Preview */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Document Preview</h2>
            <Card className="h-[calc(100vh-220px)] overflow-hidden">
              <CardContent className="p-4 h-full">
                {/* In a real app, this would be an actual document viewer */}
                <div className="flex items-center justify-center h-full border border-dashed rounded-md bg-slate-50">
                  <div className="text-center p-6">
                    <img 
                      src="/placeholder.svg" 
                      alt="Document Preview" 
                      className="w-full max-w-md mx-auto opacity-30"
                    />
                    <p className="mt-4 text-muted-foreground">
                      Document preview would be displayed here in the actual application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Panel - Data Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Extracted Data</h2>
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {fields.map((field) => (
                      <TableHead key={field.id}>{field.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {fields.map((field) => (
                      <TableCell key={field.id}>{field.value}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
