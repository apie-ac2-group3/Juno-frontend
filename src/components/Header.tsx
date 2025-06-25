
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  // Get the user's name from metadata or email
  const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="px-6 py-4 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#AD5E23] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-bold text-xl">Juno</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-muted-foreground hover:text-foreground">About Juno</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/add-journal" className="text-muted-foreground hover:text-foreground">Write</Link>
              <Link to="/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
              <Button onClick={handleLogout} variant="outline">
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline">
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
