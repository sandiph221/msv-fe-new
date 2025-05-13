import { MainNav } from "./MainNav";
import { SiteFooter } from "./SiteFooter";
import { marketingConfig } from "../config/marketingconfig";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth">
      <header className="sticky top-0 z-40 border-b border-background bg-background/40 backdrop-blur-sm">
        <div className="container flex h-24 items-center py-6">
          <MainNav items={marketingConfig.mainNav} />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
      <SiteFooter />
    </div>
  );
}
