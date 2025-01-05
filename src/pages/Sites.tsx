import React, { useState } from 'react';
import SitesTabs from '../components/sites/SitesTabs';

const Sites = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div>Overview Content</div>;
      case 'insights':
        return <div>Insights Content</div>;
      case 'apps':
        return <div>Apps Content</div>;
      case 'domains':
        return <div>Domains Content</div>;
      case 'backup':
        return <div>Backup Content</div>;
      case 'config':
        return <div>Site Config Content</div>;
      case 'actions':
        return <div>Actions Content</div>;
      case 'updates':
        return <div>Updates Content</div>;
      case 'activity':
        return <div>Activity Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sites</h1>
      <SitesTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Sites;