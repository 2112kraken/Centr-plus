import "~/styles/globals.css";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "CenterPlus Shooting Range",
  description: "Стрелковый комплекс CenterPlus",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
