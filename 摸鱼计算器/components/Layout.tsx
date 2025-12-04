import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-200 p-0 md:p-8">
      {/* Phone Container */}
      <div className="w-full h-full md:w-[375px] md:h-[812px] bg-wx-bg md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-black box-content">
        
        {/* Notch (Visual only for desktop) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-2xl z-50"></div>
        
        {/* Status Bar Area */}
        <div className="h-12 w-full bg-wx-bg flex items-center justify-between px-6 z-40 sticky top-0">
           <span className="text-xs font-bold text-black">9:41</span>
           <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 bg-black rounded-full opacity-20"></div>
              <div className="w-4 h-4 bg-black rounded-full opacity-20"></div>
              <div className="w-6 h-3 border border-gray-400 rounded-sm relative">
                  <div className="absolute inset-0.5 bg-black w-3/4"></div>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};