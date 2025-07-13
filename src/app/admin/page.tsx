'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity } from 'lucide-react';
import { 
  LazySystemMonitoring, 
  LazyAnalyticsDashboard,
  lazyUtils 
} from '@/components/lazy-loader';

const AdminPage = () => {
  // Preload componentes relacionados ao admin
  React.useEffect(() => {
    lazyUtils.preloadForRoute('/admin');
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="size-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold">Administração</h1>
            <p className="text-muted-foreground">Monitoramento e controle do sistema</p>
          </div>
        </div>
        <Badge variant="destructive">Admin Only</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Monitoramento do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LazySystemMonitoring />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LazyAnalyticsDashboard />
          </CardContent>
        </Card>
      </div>

      {/* Debug panel removido durante limpeza de código */}
    </div>
  );
};

export default AdminPage;
