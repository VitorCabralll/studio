'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export function AuthDebug() {
  const { user, userProfile, loading } = useAuth();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        Debug Auth
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Auth Debug</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Path:</strong> {pathname}
        </div>
        <div>
          <strong>Loading:</strong> 
          <Badge variant={loading ? "destructive" : "default"} className="ml-1">
            {loading ? "Yes" : "No"}
          </Badge>
        </div>
        <div>
          <strong>User:</strong> 
          <Badge variant={user ? "default" : "secondary"} className="ml-1">
            {user ? "Logged In" : "Not Logged In"}
          </Badge>
        </div>
        {user && (
          <div>
            <strong>UID:</strong> {user.uid}
          </div>
        )}
        <div>
          <strong>Profile:</strong> 
          <Badge variant={userProfile ? "default" : "secondary"} className="ml-1">
            {userProfile ? "Loaded" : "Not Loaded"}
          </Badge>
        </div>
        {userProfile && (
          <>
            <div>
              <strong>Primeiro Acesso:</strong> 
              <Badge variant={userProfile.primeiro_acesso ? "destructive" : "default"} className="ml-1">
                {userProfile.primeiro_acesso ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <strong>Setup Complete:</strong> 
              <Badge variant={userProfile.initial_setup_complete ? "default" : "destructive"} className="ml-1">
                {userProfile.initial_setup_complete ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <strong>Cargo:</strong> {userProfile.cargo || "Not set"}
            </div>
            <div>
              <strong>Areas:</strong> {userProfile.areas_atuacao?.length || 0}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 