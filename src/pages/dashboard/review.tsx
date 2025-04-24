
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Save,
  Download,
  Edit,
  Share,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentSummaryPanel } from "@/components/review/DocumentSummaryPanel";
import { DocumentViewer } from "@/components/review/DocumentViewer";
import { LineItemsTable } from "@/components/review/LineItemsTable";

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  section?: string;
  boundingBox?: { x: number, y: number, width: number, height: number };
}

interface LineItem {
  id: string;
  date: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mock data for extracted fields grouped by section
  const [fields, setFields] = useState<ExtractedField[]>([
    // Basic Information
    { id: "field-1", name: "Invoice Number", value: "9", confidence: 0.98, section: "Basic Information", boundingBox: { x: 150, y: 50, width: 50, height: 20 } },
    { id: "field-2", name: "Date", value: "29/04/2022", confidence: 0.95, section: "Basic Information", boundingBox: { x: 400, y: 50, width: 100, height: 20 } },
    
    // Buyer Detail
    { id: "field-3", name: "Invoiced to", value: "Invoice test co.", confidence: 0.92, section: "Buyer Detail", boundingBox: { x: 100, y: 120, width: 150, height: 20 } },
    { id: "field-4", name: "Address", value: "1220 Dundas St", confidence: 0.88, section: "Buyer Detail", boundingBox: { x: 100, y: 140, width: 180, height: 20 } },
    
    // Amount
    { id: "field-5", name: "Sub Total", value: "1840", confidence: 0.97, section: "Amount", boundingBox: { x: 400, y: 400, width: 80, height: 20 } },
    { id: "field-6", name: "Total", value: "1840", confidence: 0.99, section: "Amount", boundingBox: { x: 400, y: 430, width: 80, height: 20 } },
  ]);
  
  // Mock data for line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "line-1",
      date: "2022-04-29",
      description: "MARZ datastore",
      quantity: 80,
      unitPrice: 23.00,
      amount: 1840.00
    }
  ]);

  const updateFieldValue = (id: string, newValue: string) => {
    setFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };
  
  const updateLineItem = (id: string, key: keyof LineItem, value: any) => {
    setLineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };
  
  const addLineItem = () => {
    const newId = `line-${lineItems.length + 1}`;
    setLineItems(prev => [
      ...prev, 
      {
        id: newId,
        date: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0
      }
    ]);
  };
  
  const deleteAllLineItems = () => {
    setLineItems([]);
    toast.info("All line items have been deleted");
  };
  
  const deleteLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
    toast.info("Line item deleted");
  };

  const handleConfirm = () => {
    toast.success("Document processed and saved successfully");
    navigate("/dashboard/all-documents");
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Format the document type ID for display
  const documentTypeName = id === "invoices" 
    ? "Invoices" 
    : id === "onboarding" 
      ? "Onboarding Forms" 
      : "Registration Forms";
  
  const fileName = "1.pdf";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/dashboard/all-documents")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Review Document</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleConfirm}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Document Summary Panel */}
          <div className="lg:col-span-3 space-y-4">
            <DocumentSummaryPanel 
              fileName={fileName}
              currentPage={currentPage}
              totalPages={totalPages}
              fields={fields}
              updateFieldValue={updateFieldValue}
              lineItemCount={lineItems.length}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="document">Document Viewer</TabsTrigger>
                <TabsTrigger value="line-items">Line Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="document" className="space-y-4">
                {/* Document Viewer */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={handleZoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
                        <Button variant="outline" size="icon" onClick={handleZoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handlePrevPage}
                          disabled={currentPage <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{currentPage}/{totalPages}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleNextPage}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <DocumentViewer 
                      zoomLevel={zoomLevel}
                      fields={fields}
                      updateFieldValue={updateFieldValue}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="line-items" className="space-y-4">
                {/* Line Items Table */}
                <Card>
                  <CardContent className="p-4">
                    <LineItemsTable 
                      lineItems={lineItems}
                      updateLineItem={updateLineItem}
                      deleteLineItem={deleteLineItem}
                      addLineItem={addLineItem}
                      deleteAllLineItems={deleteAllLineItems}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
