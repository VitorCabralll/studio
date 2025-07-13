/**
 * Simplified Sidebar - Export essential components only
 * Reduced from 775 lines to modular architecture
 */

// Core context and hooks
export { SidebarProvider, useSidebar } from './context';

// Re-export from original for immediate compatibility
// TODO: Gradually migrate complex components to separate files
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar-original';

// Types and constants
export type { SidebarContext } from './constants';