import { Authenticated } from "convex/react";
import { Navigation } from "./Navigation";
import { SignInForm } from "../SignInForm";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated>
      <div className="h-screen flex">
        {/* <Navigation /> */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </Authenticated>
  );
}
