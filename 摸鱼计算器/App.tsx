import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Ticker } from './components/Ticker';
import { Settings } from './components/Settings';
import { Coach } from './components/Coach';
import { AppTab, UserSettings } from './types';
import { DEFAULT_SETTINGS, ICONS } from './constants';
import { useWageCalculator } from './hooks/useWageCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  
  const stats = useWageCalculator(settings);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Ticker stats={stats} settings={settings} />;
      case AppTab.SETTINGS:
        return <Settings settings={settings} onUpdate={setSettings} />;
      case AppTab.COACH:
        return <Coach settings={settings} />;
      default:
        return <Ticker stats={stats} settings={settings} />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Navigation Bar Title */}
        <div className="px-4 py-2 flex items-center justify-center relative">
             <h1 className="font-semibold text-base text-gray-900">
                {activeTab === AppTab.HOME && '薪资详情'}
                {activeTab === AppTab.SETTINGS && '参数设置'}
                {activeTab === AppTab.COACH && '职场军师'}
             </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-wx-bg overflow-y-auto no-scrollbar">
            {renderContent()}
        </div>

        {/* Bottom Tab Bar */}
        <div className="h-[80px] bg-white border-t border-gray-100 flex items-start justify-around pt-3 pb-8 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-50">
           <button 
             onClick={() => setActiveTab(AppTab.HOME)}
             className={`flex flex-col items-center space-y-1 w-16 ${activeTab === AppTab.HOME ? 'text-wx-green' : 'text-gray-400'}`}
           >
              <ICONS.Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">收入</span>
           </button>
           
           <button 
             onClick={() => setActiveTab(AppTab.COACH)}
             className={`flex flex-col items-center space-y-1 w-16 ${activeTab === AppTab.COACH ? 'text-wx-green' : 'text-gray-400'}`}
           >
              <ICONS.ChatBubble className="w-6 h-6" />
              <span className="text-[10px] font-medium">军师</span>
           </button>

           <button 
             onClick={() => setActiveTab(AppTab.SETTINGS)}
             className={`flex flex-col items-center space-y-1 w-16 ${activeTab === AppTab.SETTINGS ? 'text-wx-green' : 'text-gray-400'}`}
           >
              <ICONS.Cog className="w-6 h-6" />
              <span className="text-[10px] font-medium">设置</span>
           </button>
        </div>
      </div>
    </Layout>
  );
}