import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FoodLookup from './components/FoodLookup';
import MealPlanner from './components/MealPlanner';
import AIAssistantChat from './components/AIAssistantChat';
import PregnancyCalculator from './components/PregnancyCalculator';
import NutritionHandbook from './components/NutritionHandbook';
import BookmarksDrawer from './components/BookmarksDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import MomHealthProfile from './components/MomHealthProfile';
import DailyAdviceCard from './components/DailyAdviceCard';
import { Heart, ShieldCheck, Bot } from 'lucide-react';
import { hasApiKey } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('lookup'); // 'lookup', 'menus', 'ai-chat', 'health-profile', 'calculator', 'handbook'
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('nganbi_mombites_bookmarks');
      return saved ? JSON.parse(saved) : ['la-lot', 'rau-ngot', 'ca-hoi', 'du-du-xanh', 'qua-bo', 'ca-chep'];
    } catch {
      return ['la-lot', 'rau-ngot', 'ca-hoi', 'du-du-xanh', 'qua-bo', 'ca-chep'];
    }
  });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedFoodIdForModal, setSelectedFoodIdForModal] = useState(null);
  const [targetTrimesterForMenu, setTargetTrimesterForMenu] = useState('t1');

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nganbi_mombites_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  const handleToggleBookmark = (foodId) => {
    setBookmarks((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const handleSelectTrimesterFromCalc = (trimesterId) => {
    setTargetTrimesterForMenu(trimesterId);
    setActiveTab('menus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFoodFromBookmarks = (foodId) => {
    setSelectedFoodIdForModal(foodId);
    setActiveTab('lookup');
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-800 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />

      {/* Main Container - Full Width for AI Chat, Max-7xl for others */}
      <main className={`flex-1 w-full ${
        activeTab === 'ai-chat' 
          ? 'max-w-none px-2 sm:px-6 lg:px-8 py-3' 
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
      }`}>
        {activeTab === 'lookup' && (
          <div className="space-y-6">
            {/* Daily advice card on top of lookup page */}
            <DailyAdviceCard onNavigate={setActiveTab} />
            <FoodLookup
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              initialSelectedFoodId={selectedFoodIdForModal}
            />
          </div>
        )}

        {activeTab === 'menus' && (
          <MealPlanner
            initialTrimester={targetTrimesterForMenu}
          />
        )}

        {activeTab === 'ai-chat' && (
          <AIAssistantChat />
        )}

        {activeTab === 'health-profile' && (
          <MomHealthProfile />
        )}

        {activeTab === 'calculator' && (
          <PregnancyCalculator onSelectTrimester={handleSelectTrimesterFromCalc} />
        )}

        {activeTab === 'handbook' && (
          <NutritionHandbook />
        )}
      </main>

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        onSelectFood={handleSelectFoodFromBookmarks}
      />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-rose-100 text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-stone-100">
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤰</span>
                <span className="font-bold text-base text-stone-900">Mẹ Bầu An Tâm</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                  NganBi With Love
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Ứng dụng tra cứu an toàn thực phẩm thai kỳ theo từng giai đoạn, gợi ý thực đơn dinh dưỡng chuẩn Y khoa, tích hợp trí tuệ nhân tạo Google Gemini AI Studio (Free Tier) dành riêng cho mẹ bầu và bé yêu.
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-xl">
                  <Bot className="w-3.5 h-3.5 text-rose-500" />
                  <span>Trí tuệ nhân tạo Gemini sẵn sàng</span>
                </span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Lối Tắt Tiện Ích
              </h4>
              <ul className="text-xs space-y-2">
                <li>
                  <button onClick={() => setActiveTab('health-profile')} className="hover:text-emerald-600 font-semibold transition-colors flex items-center gap-1">
                    ❤️ Hồ sơ sức khoẻ & Phiếu khám thai
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('lookup')} className="hover:text-rose-600 transition-colors">
                    🔍 Tra cứu thực phẩm kiêng & nên ăn (104+ món)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ai-chat')} className="hover:text-purple-600 font-semibold transition-colors flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-purple-600" />
                    <span>Bác Sĩ Dinh Dưỡng AI (Google Gemini)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('menus'); setTargetTrimesterForMenu('t1'); }} className="hover:text-rose-600 transition-colors">
                    🌱 Thực đơn 3 tháng đầu (giảm ốm nghén)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('menus'); setTargetTrimesterForMenu('t2'); }} className="hover:text-rose-600 transition-colors">
                    🌿 Thực đơn 3 tháng giữa (phát triển canxi & não)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('menus'); setTargetTrimesterForMenu('t3'); }} className="hover:text-rose-600 transition-colors">
                    🍎 Thực đơn 3 tháng cuối (chuẩn bị sinh & chống táo bón)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-rose-600 transition-colors">
                    📅 Tính tuần thai & Kích thước thai nhi
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Disclaimer */}
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs leading-relaxed text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Lưu Ý Y Khoa Quan Trọng</span>
              </div>
              <p className="text-[11px]">
                Nội dung trên trang web và câu trả lời từ AI được tổng hợp dựa trên khuyến cáo dinh dưỡng của Viện Dinh Dưỡng Quốc Gia, Bộ Y Tế Việt Nam và ACOG. Thông tin chỉ mang tính chất tham khảo giáo dục. Khi có dấu hiệu nguy hiểm (ra máu, gò cứng bụng, sốt cao), mẹ hãy đến ngay bệnh viện sản gần nhất.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2 text-center sm:text-left">
            <div className="flex items-center gap-1">
              <span>Được xây dựng với tất cả yêu thương dành cho Ngân Bí</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </div>
            <div>
              © 2026 NganBiWithLove • Powered by Google AI Studio (Gemini).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
