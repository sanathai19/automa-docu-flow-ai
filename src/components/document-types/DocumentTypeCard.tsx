
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentTypeCardProps {
  id: string;
  title: string;
  uploaded: number;
  pending: number;
  approved: number;
  onEditFields: (id: string) => void;
  onUpload: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentTypeCard({
  id,
  title,
  uploaded,
  pending,
  approved,
  onEditFields,
  onUpload,
  onDelete,
}: DocumentTypeCardProps) {
  const navigate = useNavigate();

  const handleReview = () => {
    navigate(`/dashboard/review/${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditFields(id)}>
              Edit Fields
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpload(id)}>
              Upload Files
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(id)}
            >
              Delete
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
                <p className="text-2xl font-bold">{uploaded}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pending}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approved}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEditFields(id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Fields
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onUpload(id)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700" 
            onClick={handleReview}
          >
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
