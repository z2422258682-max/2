import React from 'react';
import { UserSettings } from '../types';
import { ICONS } from '../constants';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  
  const handleChange = (key: keyof UserSettings, value: string | number) => {
    let numVal = Number(value);
    if (isNaN(numVal)) return;

    // Basic validation
    if (key === 'startHour') numVal = Math.min(23, Math.max(0, numVal));
    if (key === 'endHour') numVal = Math.min(23, Math.max(0, numVal));
    if (key === 'workingDaysPerMonth') numVal = Math.min(31, Math.max(1, numVal));

    onUpdate({
      ...settings,
      [key]: numVal
    });
  };

  return (
    <div className="w-full p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">参数设置</h3>
            </div>
            
            <div className="p-0">
                {/* Monthly Salary */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900">月薪</label>
                        <span className="text-xs text-gray-400">建议填写税前薪资</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">{settings.currencySymbol}</span>
                        <input 
                            type="number" 
                            className="text-right font-bold text-gray-700 focus:outline-none w-24 bg-transparent"
                            value={settings.monthlySalary}
                            onChange={(e) => handleChange('monthlySalary', e.target.value)}
                        />
                         <ICONS.ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>

                 {/* Working Days */}
                 <div className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900">月工作天数</label>
                        <span className="text-xs text-gray-400">法定标准为 21.75 天</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="text-right font-bold text-gray-700 focus:outline-none w-20 bg-transparent"
                            value={settings.workingDaysPerMonth}
                            onChange={(e) => handleChange('workingDaysPerMonth', e.target.value)}
                        />
                        <span className="text-gray-400 text-sm">天</span>
                         <ICONS.ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>

                {/* Start Time */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900">上班时间</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="text-right font-bold text-gray-700 focus:outline-none w-16 bg-transparent"
                            value={settings.startHour}
                            onChange={(e) => handleChange('startHour', e.target.value)}
                        />
                         <span className="text-gray-400 text-sm">: 00</span>
                         <ICONS.ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>

                {/* End Time */}
                <div className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900">下班时间</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="text-right font-bold text-gray-700 focus:outline-none w-16 bg-transparent"
                            value={settings.endHour}
                            onChange={(e) => handleChange('endHour', e.target.value)}
                        />
                         <span className="text-gray-400 text-sm">: 00</span>
                         <ICONS.ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center">
            <p className="text-xs text-gray-400">数据仅保存在您的本地浏览器中，不会上传服务器。</p>
        </div>
    </div>
  );
};