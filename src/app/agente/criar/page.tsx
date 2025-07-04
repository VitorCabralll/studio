// Este é agora um Server Component por padrão.
// Ele importa e renderiza o componente cliente que contém a interatividade.

import { CriarAgenteClient } from './CriarAgenteClient';

export default function CriarAgentePage() {
  return <CriarAgenteClient />;
}