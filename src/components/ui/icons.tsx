/**
 * Optimized icon loading for LexAI
 * Tree-shaking friendly icon imports to reduce bundle size
 */

import dynamic from 'next/dynamic';
import { LucideIcon } from 'lucide-react';

// Core icons (frequently used, include in main bundle)
export { 
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  User,
  Home,
  Menu,
  Search,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

// Heavy/specialized icons (lazy loaded)
export const FileImage = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileImage })), {
  ssr: false
});

export const ScanText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ScanText })), {
  ssr: false
});

export const Copy = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Copy })), {
  ssr: false
});

export const Download = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Download })), {
  ssr: false
});

export const AlertCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), {
  ssr: false
});

export const CheckCircle2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle2 })), {
  ssr: false
});

export const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), {
  ssr: false
});

export const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), {
  ssr: false
});

export const PlusCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.PlusCircle })), {
  ssr: false
});

export const Users = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), {
  ssr: false
});

export const Trash2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trash2 })), {
  ssr: false
});

export const Briefcase = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Briefcase })), {
  ssr: false
});

export const Crown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Crown })), {
  ssr: false
});

export const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), {
  ssr: false
});

export const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })), {
  ssr: false
});

export const Upload = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Upload })), {
  ssr: false
});

export const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), {
  ssr: false
});

export const Shield = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Shield })), {
  ssr: false
});

export const Cpu = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Cpu })), {
  ssr: false
});

export const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), {
  ssr: false
});

export const FileCheck = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileCheck })), {
  ssr: false
});

export const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })), {
  ssr: false
});

export const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), {
  ssr: false
});

export const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), {
  ssr: false
});

export const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), {
  ssr: false
});

export const Monitor = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Monitor })), {
  ssr: false
});

export const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })), {
  ssr: false
});

export const Lock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lock })), {
  ssr: false
});

export const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), {
  ssr: false
});

export const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), {
  ssr: false
});

export const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), {
  ssr: false
});

export const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), {
  ssr: false
});

export const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), {
  ssr: false
});

export const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), {
  ssr: false
});

// Generic icon type for props
export type { LucideIcon };

// Utility function to create lazy-loaded icons for rare cases
export function createLazyIcon(iconName: string): React.ComponentType {
  return dynamic(() => import('lucide-react').then(mod => ({ default: (mod as any)[iconName] })), {
    ssr: false
  });
}