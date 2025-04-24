
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LineItem {
  id: string;
  date: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface LineItemsTableProps {
  lineItems: LineItem[];
  updateLineItem: (id: string, key: keyof LineItem, value: any) => void;
  deleteLineItem: (id: string) => void;
  addLineItem: () => void;
  deleteAllLineItems: () => void;
}

export function LineItemsTable({
  lineItems,
  updateLineItem,
  deleteLineItem,
  addLineItem,
  deleteAllLineItems
}: LineItemsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Calculate subtotal
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Handle input change and recalculate amount
  const handleInputChange = (id: string, key: keyof LineItem, value: any) => {
    updateLineItem(id, key, value);
    
    // If quantity or unitPrice changed, recalculate the amount
    if (key === 'quantity' || key === 'unitPrice') {
      const item = lineItems.find(item => item.id === id);
      if (item) {
        const quantity = key === 'quantity' ? parseFloat(value) || 0 : item.quantity;
        const unitPrice = key === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice;
        const newAmount = quantity * unitPrice;
        updateLineItem(id, 'amount', newAmount);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Line Items</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addLineItem}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Line
          </Button>
          
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={lineItems.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all line items? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteAllLineItems}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No line items. Click "Add Line" to create one.
                </TableCell>
              </TableRow>
            ) : (
              lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleInputChange(item.id, 'date', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="h-8 text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleInputChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="h-8 text-right"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLineItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Box */}
      <div className="flex justify-end mt-6">
        <div className="w-64 border rounded-md p-4">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1">Sub Total</td>
                <td className="py-1 text-right font-medium">{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1">Tax %</td>
                <td className="py-1 text-right">0.000%</td>
              </tr>
              <tr>
                <td className="py-1">Tax Amount</td>
                <td className="py-1 text-right">-</td>
              </tr>
              <tr className="border-t">
                <td className="py-1 font-semibold">Total</td>
                <td className="py-1 text-right font-semibold">{subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
