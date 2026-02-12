import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FileText, Upload, X, Download, File } from "lucide-react";

interface AttachedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
}

interface DocumentAttachmentProps {
  documents: AttachedDocument[];
  onDocumentsChange: (documents: AttachedDocument[]) => void;
  maxDocuments?: number;
  acceptedTypes?: string[];
}

export function DocumentAttachment({ 
  documents, 
  onDocumentsChange, 
  maxDocuments = 5,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png']
}: DocumentAttachmentProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    const newDocuments: AttachedDocument[] = files.slice(0, maxDocuments - documents.length).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  }, [documents, onDocumentsChange, maxDocuments]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newDocuments: AttachedDocument[] = files.slice(0, maxDocuments - documents.length).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  }, [documents, onDocumentsChange, maxDocuments]);

  const removeDocument = useCallback((id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  }, [documents, onDocumentsChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return File;
    return FileText;
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'DOC';
    if (type.includes('image')) return 'IMG';
    return 'FILE';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <Card 
          className={`border-2 border-dashed transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Drop documents here</p>
            <p className="text-xs text-muted-foreground mb-3">
              Supported: {acceptedTypes.join(', ')}
            </p>
            <input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
              id="document-upload"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="document-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {documents.length}/{maxDocuments} documents attached
            </p>
          </CardContent>
        </Card>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((document) => {
              const FileIcon = getFileIcon(document.type);
              return (
                <Card key={document.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{document.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getFileTypeLabel(document.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(document.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => document.url && window.open(document.url)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(document.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}