
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Settings, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const workspaces = [
  { name: "Workspace Pessoal", members: 1, isOwner: true },
  { name: "Escritório & Associados", members: 5, isOwner: false },
  { name: "Projetos Especiais", members: 3, isOwner: true },
];

export default function WorkspacePage() {
  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Gerenciar Workspaces</h1>
          <p className="text-muted-foreground">Organize seus projetos e equipes em workspaces separados.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Criar Novo Workspace</DialogTitle>
              <DialogDescription>
                Dê um nome ao seu novo workspace. Você poderá convidar membros depois.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input id="name" defaultValue="Meu Novo Workspace" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Criar Workspace</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{ws.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Users className="h-4 w-4" />
                <span>{ws.members} {ws.members > 1 ? 'membros' : 'membro'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6"><AvatarFallback>A</AvatarFallback></Avatar>
                    <Avatar className="h-6 w-6"><AvatarFallback>B</AvatarFallback></Avatar>
                    {ws.members > 2 && <Avatar className="h-6 w-6"><AvatarFallback>+ {ws.members - 2}</AvatarFallback></Avatar>}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {ws.isOwner && (
                <>
                  <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </>
              )}
              <Button>Abrir</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
