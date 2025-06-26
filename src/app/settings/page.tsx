import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil, aparência e as configurações do seu workspace.</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
              <CardTitle className="font-headline">Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent>
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

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Aparência</CardTitle>
                <CardDescription>Personalize a aparência do aplicativo. Mude entre o modo claro e escuro.</CardDescription>
            </CardHeader>
            <CardContent>
                <ThemeToggle />
            </CardContent>
        </Card>

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
  );
}
