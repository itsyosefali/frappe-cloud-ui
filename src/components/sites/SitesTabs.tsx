import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
}

interface BillingTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'insights', label: 'Insights' },
  { id: 'apps', label: 'Apps' },
  { id: 'domains', label: 'Domains' },
  { id: 'backups', label: 'Backups' },
  { id: 'site-config', label: 'Site Config' },
  { id: 'actions', label: 'Actions' },
  { id: 'updates', label: 'Updates' },
  { id: 'activity', label: 'Activity' },
];

const SitesTabs = ({ activeTab, onTabChange }: BillingTabsProps) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SitesTabs;