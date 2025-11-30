import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img 
            src="/roblox.png" 
            alt="Logo Robux Chance Hub" 
            className="h-8 w-8" 
          />
          <span className="font-bold font-fredoka hidden sm:inline-block">
            Robux Chance Hub
          </span>
        </Link>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button><LogIn className="w-4 h-4 mr-2" /> Entrar</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;