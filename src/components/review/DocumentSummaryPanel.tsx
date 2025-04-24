
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Share, Trash2, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  section?: string;
}

interface DocumentSummaryPanelProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  fields: ExtractedField[];
  updateFieldValue: (id: string, newValue: string) => void;
  lineItemCount: number;
}

export function DocumentSummaryPanel({
  fileName,
  currentPage,
  totalPages,
  fields,
  updateFieldValue,
  lineItemCount
}: DocumentSummaryPanelProps) {
  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || "Other";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  const handleEditFields = () => {
    toast.info("Field editing mode activated");
  };

  const handleDownload = () => {
    toast.info("Download functionality not implemented in MVP");
  };

  const handleShare = () => {
    toast.info("Share functionality not implemented in MVP");
  };

  const handleDelete = () => {
    toast.info("Delete functionality not implemented in MVP");
  };

  const handleNavigateToLineItems = () => {
    // Find the line items tab trigger and programmatically click it
    const lineItemsTab = document.querySelector('[data-value="line-items"]') as HTMLElement;
    if (lineItemsTab) {
      lineItemsTab.click();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Document Summary</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditFields}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Fields
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Information */}
        <div>
          <h3 className="text-sm font-semibold mb-2">File Information</h3>
          <div className="bg-muted rounded-md p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{fileName}</span>
              <span className="text-xs text-muted-foreground">{currentPage}/{totalPages}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sections of fields */}
        {Object.entries(groupedFields).map(([section, sectionFields]) => (
          <div key={section}>
            <h3 className="text-sm font-semibold mb-2">{section}</h3>
            <div className="space-y-3">
              {sectionFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex justify-between">
                    <label htmlFor={field.id} className="text-xs font-medium">
                      {field.name}
                    </label>
                    {field.confidence >= 0.8 && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  <input
                    id={field.id}
                    type="text"
                    value={field.value}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    className={`w-full text-sm px-3 py-1.5 border rounded-md ${
                      field.confidence < 0.8 ? "border-yellow-300 bg-yellow-50" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </div>
        ))}

        {/* Line Items Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Line Items</h3>
          <div 
            className="bg-muted rounded-md p-3 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={handleNavigateToLineItems}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm">View Line Items</span>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {lineItemCount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
