import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/3 p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/3 p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form fields */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            
            {/* Upload area */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/3 p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}