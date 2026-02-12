import { Menu } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";

interface Props {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: Props) => {
  const { logout } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/products":
        return "Products";
      case "/suppliers":
        return "Suppliers";
      case "/purchase-orders":
        return "Purchase Orders";
      case "/low-stock":
        return "Low Stock Alerts";
      default:
        return "Inventory SaaS";
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden">
          <Menu />
        </button>

        <h2 className="text-lg font-semibold">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
