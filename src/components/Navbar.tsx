import React from 'react';
import { Menu, LogOut, User, Bell, Boxes } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <div className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b z-10">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section with mobile menu */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Center section with logo */}
        <div className="hidden md:flex items-center gap-2">
          <Boxes className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">SASS Manager</span>
        </div>

        {/* Right section with notifications, user profile, and logout */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <span className="hidden md:inline text-sm font-medium">John Doe</span>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-5 w-5" />
      
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;