import { StoreShell } from "@/components/layout";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return <StoreShell>{children}</StoreShell>;
}
