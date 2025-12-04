import React, { useState } from 'react';
import { UserSettings } from '../types';
import { GoogleGenAI } from "@google/genai";
import { ICONS } from '../constants';

interface CoachProps {
  settings: UserSettings;
}

export const Coach: React.FC<CoachProps> = ({ settings }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  
  const handleGetAdvice = async () => {
    if (!process.env.API_KEY) {
      setAdvice("需要有效的 API Key 才能分析您的职业潜力。请配置环境。");
      return;
    }
    
    if (!jobTitle.trim()) {
        setAdvice("请先输入您的职位名称。");
        return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Prompt updated to request Chinese response
      const prompt = `
        我是一名 ${jobTitle}，月薪 ${settings.currencySymbol}${settings.monthlySalary}。
        我的工作时间是从 ${settings.startHour}:00 到 ${settings.endHour}:00。
        
        请扮演一位幽默但实用的职场导师。
        1. 评价一下这个薪资在当前市场是否有竞争力？（大概猜一下）
        2. 给三个建议让我提升“秒薪”或身价。
        3. 给一个有趣的“摸鱼”或“向上管理”技巧，最大化我的“时薪”。
        
        请保持回答简短（150字以内），使用 Markdown 格式，语气轻松幽默。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAdvice(response.text || "暂时无法生成建议。");
    } catch (e) {
      console.error(e);
      setAdvice("连接职场矩阵时出错。请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 h-full flex flex-col">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-wx-green rounded-full flex items-center justify-center text-white">
                    <ICONS.ChatBubble className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">职场军师</h2>
                    <p className="text-xs text-gray-400">由 Gemini AI 驱动</p>
                </div>
           </div>

           <div className="space-y-4 mb-6">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">您的职位是？</label>
                   <input 
                      type="text"
                      placeholder="例如：高级前端工程师"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wx-green/20"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                   />
               </div>
               
               <button
                  onClick={handleGetAdvice}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-wait' : 'bg-wx-green hover:bg-green-600 shadow-lg shadow-green-600/20'}`}
               >
                  {loading ? '正在分析身价...' : '分析我的身价'}
               </button>
           </div>

           <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto no-scrollbar border border-gray-100">
               {advice ? (
                   <div className="prose prose-sm prose-green">
                       <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                           {advice}
                       </div>
                   </div>
               ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                       <ICONS.ChatBubble className="w-12 h-12 mb-2" />
                       <p className="text-sm text-center">输入职位名称以解锁<br/>您的薪资潜力。</p>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};