
import React, { useState } from "react";
import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  boundingBox?: { x: number, y: number, width: number, height: number };
}

interface DocumentViewerProps {
  zoomLevel: number;
  fields: ExtractedField[];
  updateFieldValue: (id: string, newValue: string) => void;
}

export function DocumentViewer({ zoomLevel, fields, updateFieldValue }: DocumentViewerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const handleToggleFullScreen = () => {
    const docViewer = document.getElementById('document-viewer');
    if (!docViewer) return;
    
    if (!document.fullscreenElement) {
      docViewer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  
  const handleBoundingBoxClick = (field: ExtractedField) => {
    setEditingField(field.id);
  };
  
  const handleFieldValueChange = (id: string, value: string) => {
    updateFieldValue(id, value);
  };
  
  const handleFieldBlur = () => {
    setEditingField(null);
  };

  return (
    <div 
      id="document-viewer" 
      className="relative border rounded-md overflow-hidden bg-gray-100"
      style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}
    >
      <div className="absolute top-2 right-2 z-10">
        <Button variant="outline" size="icon" onClick={handleToggleFullScreen}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Document content (mock PDF) */}
      <div 
        className="h-full w-full overflow-auto bg-white relative"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
      >
        {/* This would be replaced with an actual PDF viewer in a real implementation */}
        <div className="p-12 min-h-full" style={{ width: '800px', height: '1100px' }}>
          {/* Mock invoice document */}
          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold">Invoice</h1>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-sm">Invoice test co.</p>
                <p className="text-sm">1220 Dundas St</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><span className="font-semibold">Invoice #:</span> 9</p>
                <p className="text-sm"><span className="font-semibold">Date:</span> 29/04/2022</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-right">QTY</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">2022-04-29</td>
                  <td className="py-2">MARZ datastore</td>
                  <td className="py-2 text-right">80</td>
                  <td className="py-2 text-right">23.00</td>
                  <td className="py-2 text-right">1,840.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>1,840.00</span>
              </div>
              <div className="flex justify-between py-1 border-t border-b font-bold">
                <span>Total:</span>
                <span>1,840.00</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bounding boxes for fields */}
        {fields.map(field => {
          if (!field.boundingBox) return null;
          
          const { x, y, width, height } = field.boundingBox;
          const isEditing = editingField === field.id;
          
          return (
            <div
              key={field.id}
              className={`absolute border-2 cursor-pointer group ${
                field.confidence >= 0.8 ? 'border-green-400' : 'border-yellow-400'
              }`}
              style={{ 
                left: `${x}px`, 
                top: `${y}px`, 
                width: `${width}px`, 
                height: `${height}px`,
              }}
              onClick={() => handleBoundingBoxClick(field)}
            >
              <div className="absolute -top-6 left-0 bg-white px-2 py-0.5 text-xs border rounded shadow-sm">
                {field.name}
              </div>
              
              {isEditing && (
                <div className="absolute -bottom-10 left-0 w-48 z-20">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                    onBlur={handleFieldBlur}
                    autoFocus
                    className="w-full border rounded px-2 py-1 text-sm shadow-md"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
