import React from 'react';
import { Heart, Search, Utensils, Calendar, BookOpen, BookmarkCheck, Bot, HeartPulse } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, bookmarksCount, onOpenBookmarks }) {
  const navItems = [
    { id: 'lookup', label: 'Tra Cứu Thực Phẩm', icon: Search, badge: '104+ món' },
    { id: 'menus', label: 'Gợi Ý Thực Đơn', icon: Utensils, badge: 'Theo tuần' },
    { id: 'ai-chat', label: 'Bác Sĩ AI (Gemini)', icon: Bot, badge: 'AI Studio', isAi: true },
    { id: 'health-profile', label: 'Hồ Sơ Sức Khoẻ', icon: HeartPulse, badge: 'Mới', isHealth: true },
    { id: 'calculator', label: 'Tính Tuần Thai', icon: Calendar },
    { id: 'handbook', label: 'Cẩm Nang', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
        <span>Dinh dưỡng thai kỳ chuẩn Y khoa dành riêng cho mẹ bầu và bé yêu • NganBi With Love</span>
        <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('lookup')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">🤰</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-stone-800 tracking-tight group-hover:text-rose-600 transition-colors">
                  Mẹ Bầu An Tâm
                </h1>
                <span className="inline-flex items-center text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                  With Love ❤️
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Tra cứu an toàn thực phẩm & Gợi ý thực đơn chuẩn thai kỳ
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? item.isAi 
                        ? 'bg-purple-50 text-purple-700 shadow-xs border border-purple-200'
                        : item.isHealth
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 shadow-xs border border-rose-200/80'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (item.isAi ? 'text-purple-600' : item.isHealth ? 'text-emerald-600' : 'text-rose-600') : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] text-white px-1.5 py-0.2 rounded-full font-bold ${
                      item.isAi ? 'bg-gradient-to-r from-purple-600 to-pink-500' 
                      : item.isHealth ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-rose-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action button (Only Bookmarks, hidden API key) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBookmarks}
              className="relative p-2.5 rounded-xl border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 hover:bg-rose-50/50 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Danh sách món đã lưu"
            >
              <BookmarkCheck className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Đã lưu</span>
              {bookmarksCount > 0 && (
                <span className="min-w-5 h-5 px-1 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-rose-50 py-2 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? item.isAi ? 'text-purple-600 font-bold bg-purple-50' 
                    : item.isHealth ? 'text-emerald-600 font-bold bg-emerald-50'
                    : 'text-rose-600 font-bold bg-rose-50/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isActive ? (item.isAi ? 'text-purple-600' : item.isHealth ? 'text-emerald-600' : 'text-rose-600') : 'text-stone-400'}`} />
                <span>{item.label.split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
