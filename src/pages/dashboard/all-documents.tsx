
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, FileText, MoreHorizontal, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  type: "invoice" | "onboarding" | "registration";
  status: "pending" | "approved" | "rejected";
  uploadedBy: string;
  dateModified: string;
  dateAdded: string;
}

export default function AllDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app this would come from an API
  const documents: Document[] = [
    {
      id: "doc-001",
      name: "Invoice-April2025.pdf",
      type: "invoice",
      status: "approved",
      uploadedBy: "John Doe",
      dateModified: "2025-04-18",
      dateAdded: "2025-04-15",
    },
    {
      id: "doc-002",
      name: "NewEmployeeForm-Sarah.pdf",
      type: "onboarding",
      status: "pending",
      uploadedBy: "Jane Smith",
      dateModified: "2025-04-17",
      dateAdded: "2025-04-17",
    },
    {
      id: "doc-003",
      name: "ClientRegistration-Acme.pdf",
      type: "registration",
      status: "approved",
      uploadedBy: "John Doe",
      dateModified: "2025-04-16",
      dateAdded: "2025-04-10",
    },
    {
      id: "doc-004",
      name: "Invoice-March2025.pdf",
      type: "invoice",
      status: "rejected",
      uploadedBy: "Jane Smith",
      dateModified: "2025-04-12",
      dateAdded: "2025-04-05",
    },
    {
      id: "doc-005",
      name: "NewEmployeeForm-Mike.pdf",
      type: "onboarding",
      status: "pending",
      uploadedBy: "John Doe",
      dateModified: "2025-04-11",
      dateAdded: "2025-04-11",
    },
    {
      id: "doc-006",
      name: "ClientRegistration-XYZ.pdf",
      type: "registration",
      status: "approved",
      uploadedBy: "Jane Smith",
      dateModified: "2025-04-09",
      dateAdded: "2025-04-02",
    },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "invoice":
        return "Invoice";
      case "onboarding":
        return "Onboarding Form";
      case "registration":
        return "Registration Form";
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{document.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getDocumentTypeLabel(document.type)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(document.status)} variant="outline">
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{document.uploadedBy}</TableCell>
                    <TableCell>{document.dateModified}</TableCell>
                    <TableCell>{document.dateAdded}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
