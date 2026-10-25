import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Página no encontrada | Cloud Native Santo Domingo",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
