import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles, Bookmark, ArrowRight, X, Bot, Loader2, KeyRound, Trash2, Check } from 'lucide-react';
import { FOODS_DATA, FOOD_CATEGORIES, SAFETY_LEVELS } from '../data/foodsData';
import { searchMatches } from '../utils/vietnameseSearch';
import { analyzeFoodWithAI, hasApiKey } from '../services/geminiService';
import { getStoredCustomFoods, saveCustomFood, deleteCustomFood, CUSTOM_FOODS_EVENT } from '../utils/customFoodsStorage';
import FoodDetailModal from './FoodDetailModal';

export default function FoodLookup({ bookmarks, onToggleBookmark, initialSelectedFoodId, onOpenApiKeyModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTrimester, setSelectedTrimester] = useState('all'); // 'all', 't1', 't2', 't3'
  const [selectedSafety, setSelectedSafety] = useState('all'); // 'all', 'safe', 'caution', 'avoid'
  const [selectedFood, setSelectedFood] = useState(null);

  // AI Food Analysis state - initialized from localStorage so user never loses added foods
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiCustomFoods, setAiCustomFoods] = useState(() => getStoredCustomFoods());
  const [aiError, setAiError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Sync with localStorage when custom foods change
  useEffect(() => {
    const handleSync = () => {
      setAiCustomFoods(getStoredCustomFoods());
    };
    window.addEventListener(CUSTOM_FOODS_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(CUSTOM_FOODS_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // If initialSelectedFoodId is provided, open it
  useEffect(() => {
    if (initialSelectedFoodId) {
      const allList = [...aiCustomFoods, ...FOODS_DATA];
      const target = allList.find(f => f.id === initialSelectedFoodId);
      if (target) setSelectedFood(target);
    }
  }, [initialSelectedFoodId, aiCustomFoods]);

  // Combined foods list (AI discovered persistent foods + built-in FOODS_DATA)
  const combinedFoods = useMemo(() => {
    return [...aiCustomFoods, ...FOODS_DATA];
  }, [aiCustomFoods]);

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return combinedFoods.filter((food) => {
      // 1. Search Query
      const matchSearch = searchMatches(
        searchQuery,
        food.name,
        food.summary,
        food.reason,
        food.risks,
        food.advice,
        ...(food.aliases || [])
      );
      if (!matchSearch) return false;

      // 2. Category
      if (selectedCategory === 'ai_added') {
        if (!food.isAiAnalyzed) return false;
      } else if (selectedCategory !== 'all' && food.category !== selectedCategory) {
        return false;
      }

      // 3. Trimester & Safety
      if (selectedSafety !== 'all') {
        if (selectedTrimester === 't1') {
          if (food.statusT1 !== selectedSafety) return false;
        } else if (selectedTrimester === 't2') {
          if (food.statusT2 !== selectedSafety) return false;
        } else if (selectedTrimester === 't3') {
          if (food.statusT3 !== selectedSafety) return false;
        } else {
          // If selectedTrimester is 'all', matches if ANY trimester has this safety status
          const hasSafety = food.statusT1 === selectedSafety || food.statusT2 === selectedSafety || food.statusT3 === selectedSafety;
          if (!hasSafety) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTrimester, selectedSafety, combinedFoods]);

  // Statistics
  const counts = useMemo(() => {
    let safe = 0;
    let caution = 0;
    let avoid = 0;

    combinedFoods.forEach(food => {
      const status = selectedTrimester === 't1' ? food.statusT1
        : selectedTrimester === 't2' ? food.statusT2
        : selectedTrimester === 't3' ? food.statusT3
        : null;

      if (status) {
        if (status === 'safe') safe++;
        if (status === 'caution') caution++;
        if (status === 'avoid') avoid++;
      } else {
        if (food.statusT1 === 'avoid' || food.statusT2 === 'avoid' || food.statusT3 === 'avoid') {
          avoid++;
        } else if (food.statusT1 === 'caution' || food.statusT2 === 'caution' || food.statusT3 === 'caution') {
          caution++;
        } else {
          safe++;
        }
      }
    });

    return { safe, caution, avoid, total: combinedFoods.length };
  }, [selectedTrimester, combinedFoods]);

  // Handle AI analysis for food and save it permanently for future use
  const handleAnalyzeWithAI = async (targetFoodName) => {
    const query = (targetFoodName || searchQuery).trim();
    if (!query) return;

    if (!hasApiKey()) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    setAiAnalyzing(true);
    setAiError('');

    try {
      const result = await analyzeFoodWithAI(query);
      if (result && result.name) {
        // Save permanently to localStorage so it is available from now on
        const savedFood = saveCustomFood(result);

        // Update local state immediately
        setAiCustomFoods(getStoredCustomFoods());

        // Notify user with success toast
        setToastMessage(`Đã thêm "${savedFood.name}" vào danh sách thực phẩm! Mẹ có thể tra cứu lại bất cứ lúc nào.`);
        setTimeout(() => setToastMessage(''), 6000);

        // Open detail modal for immediate inspection
        setSelectedFood(savedFood);

        // Clear or set search to match the newly added food
        setSearchQuery(savedFood.name);
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'MISSING_API_KEY') {
        if (onOpenApiKeyModal) onOpenApiKeyModal();
      } else {
        setAiError(err.message || 'Không thể kết nối Google AI Studio. Vui lòng kiểm tra lại kết nối mạng.');
      }
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Delete an AI-added custom food
  const handleDeleteCustomFood = (food, e) => {
    e.stopPropagation();
    if (window.confirm(`Mẹ có chắc muốn xóa món "${food.name}" khỏi danh sách thực phẩm đã lưu không?`)) {
      deleteCustomFood(food.id);
      setToastMessage(`Đã xóa món "${food.name}" khỏi danh mục.`);
      setTimeout(() => setToastMessage(''), 3000);
      if (selectedFood?.id === food.id) {
        setSelectedFood(null);
      }
    }
  };

  const trimesterTabs = [
    { id: 'all', label: 'Cả Thai Kỳ (9 tháng)', shortLabel: 'Tất cả' },
    { id: 't1', label: '3 Tháng Đầu', shortLabel: 'T1: Tuần 1-12', desc: 'Dễ dọa sảy, kiêng chất co bóp' },
    { id: 't2', label: '3 Tháng Giữa', shortLabel: 'T2: Tuần 13-27', desc: 'Phát triển khung xương & não' },
    { id: 't3', label: '3 Tháng Cuối', shortLabel: 'T3: Tuần 28-40', desc: 'Chống táo bón & tiểu đường' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Search Box */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-6 sm:p-8 border border-rose-100/90 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-200 text-rose-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kho dữ liệu 104+ thực phẩm chuẩn Y khoa & Phân tích Gemini AI</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            Mẹ bầu có được ăn món này không?
          </h2>
          <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">
            Tra cứu hơn <strong>104+ món ăn, thảo mộc & gia vị hàng ngày</strong> (lá lốt, hành, thì là, rau muống, cá chép, ốc...). Nếu không có sẵn, <strong>Bác sĩ AI (Gemini)</strong> sẽ lập tức phân tích cho mẹ!
          </p>

          {/* Search Input */}
          <div className="mt-5 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm lá lốt, hành, thì là, rau muống, cá chép, gia vị..."
                className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border-2 border-rose-200/80 focus:border-rose-500 focus:outline-hidden text-stone-900 placeholder-stone-400 text-base shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-semibold">Tìm nhanh:</span>
              {[
                'Lá lốt', 'Hành', 'Thì là', 'Kinh giới', 'Tỏi', 
                'Rau muống', 'Đậu bắp', 'Cà tím', 'Cá chép', 
                'Ốc', 'Lươn', 'Mắm tôm', 'Đậu đen'
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-rose-200/80 transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-15 select-none pointer-events-none">
          🥑
        </div>
      </div>

      {/* AI Analyzing banner if in progress */}
      {aiAnalyzing && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white shadow-lg flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base">Bác sĩ AI (Google Gemini) đang phân tích y khoa món "{searchQuery}"...</h4>
              <p className="text-xs text-rose-100">Đang đánh giá tác động 3 tam cá nguyệt, cơ chế độc tính & lời khuyên sơ chế.</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Error banner */}
      {aiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{aiError}</span>
          <button onClick={() => setAiError('')} className="font-bold ml-2">Đóng ✕</button>
        </div>
      )}

      {/* Trimester Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            1. Chọn giai đoạn mang thai cần tra cứu:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {trimesterTabs.map((tab) => {
              const isSelected = selectedTrimester === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTrimester(tab.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-sm">{tab.label}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                    {tab.shortLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Filter Buttons */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1">
              2. Mức an toàn:
            </span>
            <button
              onClick={() => setSelectedSafety('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSafety === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tất cả ({counts.total})
            </button>
            <button
              onClick={() => setSelectedSafety('safe')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedSafety === 'safe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Nên ăn / An toàn
            </button>
            <button
              onClick={() => setSelectedSafety('caution')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedSafety === 'caution'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Cần cẩn trọng
            </button>
            <button
              onClick={() => setSelectedSafety('avoid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedSafety === 'avoid'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Nên tránh / Kiêng
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Tìm thấy <strong className="text-rose-600">{filteredFoods.length}</strong> thực phẩm phù hợp
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FOOD_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid or Empty State with AI prompt */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-rose-200 p-8 space-y-4">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-stone-800">
            Không tìm thấy món "{searchQuery}" trong kho dữ liệu có sẵn
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Đừng lo lắng! <strong>Google Gemini AI</strong> có thể phân tích thành phần y khoa của bất kỳ món ăn nào theo chuẩn sản khoa.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleAnalyzeWithAI(searchQuery)}
              disabled={aiAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <Bot className="w-4 h-4" />
              <span>{aiAnalyzing ? 'Đang phân tích...' : `Hỏi AI (Gemini) phân tích "${searchQuery}"`}</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSafety('all');
              }}
              className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition-colors"
            >
              Xem tất cả món có sẵn
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => {
            const isBookmarked = bookmarks.includes(food.id);

            // Get relevant status to display primary badge based on selectedTrimester
            const primaryStatus = selectedTrimester === 't1' ? food.statusT1
              : selectedTrimester === 't2' ? food.statusT2
              : selectedTrimester === 't3' ? food.statusT3
              : (food.statusT1 === 'avoid' || food.statusT2 === 'avoid' || food.statusT3 === 'avoid') ? 'avoid'
              : (food.statusT1 === 'caution' || food.statusT2 === 'caution') ? 'caution' : 'safe';

            const primaryConfig = SAFETY_LEVELS[primaryStatus] || SAFETY_LEVELS.safe;

            return (
              <div
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="group relative bg-white rounded-3xl border border-stone-200/90 hover:border-rose-300 p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top card row: icon, name, bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-stone-50 group-hover:bg-rose-50/50 border border-stone-100 flex items-center justify-center text-3xl transition-colors">
                        {food.image}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-stone-900 group-hover:text-rose-600 transition-colors text-base line-clamp-1">
                            {food.name}
                          </h3>
                          {food.isAiAnalyzed && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded-md">
                              AI
                            </span>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${primaryConfig.badgeClass} mt-0.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${primaryConfig.dotClass}`}></span>
                          {primaryConfig.label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(food.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isBookmarked
                          ? 'bg-rose-500 text-white'
                          : 'text-stone-300 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                      title={isBookmarked ? 'Bỏ lưu' : 'Lưu món này'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {food.summary}
                  </p>
                </div>

                <div>
                  {/* Trimester matrix pills */}
                  <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-1.5 text-center">
                    <div className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border ${(SAFETY_LEVELS[food.statusT1] || SAFETY_LEVELS.safe).badgeClass}`}>
                      <span className="block text-[9px] opacity-70">3T Đầu</span>
                      <span>{(SAFETY_LEVELS[food.statusT1] || SAFETY_LEVELS.safe).label.split('/')[0]}</span>
                    </div>
                    <div className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border ${(SAFETY_LEVELS[food.statusT2] || SAFETY_LEVELS.safe).badgeClass}`}>
                      <span className="block text-[9px] opacity-70">3T Giữa</span>
                      <span>{(SAFETY_LEVELS[food.statusT2] || SAFETY_LEVELS.safe).label.split('/')[0]}</span>
                    </div>
                    <div className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border ${(SAFETY_LEVELS[food.statusT3] || SAFETY_LEVELS.safe).badgeClass}`}>
                      <span className="block text-[9px] opacity-70">3T Cuối</span>
                      <span>{(SAFETY_LEVELS[food.statusT3] || SAFETY_LEVELS.safe).label.split('/')[0]}</span>
                    </div>
                  </div>

                  {/* Bottom link */}
                  <div className="mt-3 flex items-center justify-between text-xs text-stone-400 group-hover:text-rose-600 font-medium">
                    <span>Xem lý do y khoa & cách sơ chế</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          isBookmarked={bookmarks.includes(selectedFood.id)}
          onToggleBookmark={onToggleBookmark}
        />
      )}
    </div>
  );
}
