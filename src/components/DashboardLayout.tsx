import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="pt-16 md:pl-64 min-h-screen bg-gray-50">
      <div className="p-6">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;