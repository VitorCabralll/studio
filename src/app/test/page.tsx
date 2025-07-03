// Página de teste mínima para verificar se servidor funciona
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">🧪 Teste do Servidor</h1>
      <p>Se você está vendo isso, o servidor Next.js está funcionando!</p>
      <div className="mt-4 p-4 bg-green-100 rounded">
        ✅ Firebase: Configurado<br />
        ✅ Next.js: Funcionando<br />
        ✅ TypeScript: OK<br />
        ✅ Tailwind: Ativo
      </div>
    </div>
  );
}