import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PublicShell from "@/components/layout/PublicShell";
import { getSection } from "@/lib/content";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, social] = await Promise.all([
    getSection("site"),
    getSection("social"),
  ]);

  return (
    <>
      <Navigation site={site} socialLinks={social.links} />
      <PublicShell>
        {children}
        <Footer />
      </PublicShell>
    </>
  );
}
