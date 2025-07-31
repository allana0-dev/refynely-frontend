import "../styles/globals.css";
import Layout from "../components/Layout";
import Providers from "./providers"; // adjust path if placed elsewhere
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Refynely - AI Powered Pitch Decks",
  description: "Generate AI Powered Pitch Decks in Seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-slate-50 ${poppins.className}`}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
