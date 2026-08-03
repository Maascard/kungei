import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./base.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-base-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "the BASE — напитки, которые задают тон",
  description:
    "Матча, латте, фраппе и крем-напитки the BASE — яркие вкусы в удобной упаковке.",
};

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${unbounded.variable} bg-baseblack`}>{children}</div>;
}
