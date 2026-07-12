import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/layout/container";

/** Site header shell: sticky, bordered, with brand + nav + theme toggle. */
export function Header() {
  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            WKCwP
          </Link>
          <nav className="flex items-center gap-6">
            {/* Nav links placeholder — wire up when routes exist. */}
            <ThemeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
