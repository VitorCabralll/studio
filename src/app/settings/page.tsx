import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e as configurações do seu workspace.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais e avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="lawyer portrait"/>
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <Button variant="outline">Alterar Foto</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="full-name">Nome Completo</Label>
                        <Input id="full-name" defaultValue="Advogado Teste" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="advogado@lexai.com" disabled />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
                <Button>Salvar Alterações</Button>
            </CardFooter>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Workspace</CardTitle>
                <CardDescription>Gerencie as configurações do seu workspace atual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="workspace-name">Nome do Workspace</Label>
                    <Input id="workspace-name" defaultValue="Workspace Pessoal" />
                </div>
                <Separator />
                <div>
                    <h4 className="font-medium text-destructive">Zona de Perigo</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                        A exclusão do workspace é uma ação irreversível.
                    </p>
                    <Button variant="destructive">Excluir Workspace</Button>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
