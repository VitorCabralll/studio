'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LazyDocumentProcessor, 
  LazyWorkspaceSettings, 
  LazyOCRProcessor,
  lazyUtils 
} from '@/components/lazy-loader';

const WorkspacePage = () => {
  // Preload componentes relacionados ao workspace
  React.useEffect(() => {
    lazyUtils.preloadForRoute('/workspace');
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspace</h1>
          <p className="text-muted-foreground">Gerencie documentos e configure seu ambiente de trabalho</p>
        </div>
        <Badge variant="secondary">Lazy Loading Demo</Badge>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="ocr">OCR</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processador de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyDocumentProcessor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OCR - Extração de Texto</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyOCRProcessor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyWorkspaceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspacePage;