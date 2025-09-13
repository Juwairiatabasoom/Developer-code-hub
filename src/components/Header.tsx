import { Menu, Plus, Code2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onCreateSnippet: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onCreateSnippet, onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const { signOut, user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Snippet Vault
              </h1>
              <p className="text-xs text-muted-foreground">
                Developer's Code Repository
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user?.email}
          </span>
          <Button onClick={onCreateSnippet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Snippet
          </Button>
          <Button onClick={signOut} size="sm" variant="outline">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};