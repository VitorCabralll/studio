/**
 * Magic UI - Biblioteca unificada de animações
 * 
 * CONSOLIDADO: Todos os componentes agora vêm de /ui/motion.tsx
 * Esta é apenas uma camada de compatibilidade.
 */

// Importar tudo da biblioteca oficial
export { 
  FadeIn,
  SlideUp,
  ScaleIn,
  AnimatedCard,
  AnimatedButton,
  StaggerContainer,
  StaggerItem,
  TextAnimate,
  TextAnimateByCharacter,
  BlobAnimation,
  motion
} from '../ui/motion';

// Componentes animated-beam e animated-list foram removidos (código morto)
// export { AnimatedBeam } from './animated-beam';
// export { AnimatedList, AnimatedNotification } from './animated-list';

// NOTA: Os componentes fade-in.tsx e text-animate.tsx foram removidos
// em favor das versões mais avançadas em /ui/motion.tsx