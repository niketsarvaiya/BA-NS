import type { UserRole } from "@/modules/auth/types";

export type AppRole = UserRole;

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles?: AppRole[]; // if omitted, visible to all authenticated users
  children?: NavItem[];
}
