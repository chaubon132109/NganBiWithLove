import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Heart, Sparkles, ChefHat, ArrowRight, Bookmark } from 'lucide-react';
import { SAFETY_LEVELS } from '../data/foodsData';

export default function FoodDetailModal({ food, onClose, isBookmarked, onToggleBookmark }) {
  if (!food) return null;

  const renderTrimesterBadge = (status, label, range) => {
    const config = SAFETY_LEVELS[status];
    return (
      <div className="flex-1 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-stone-500 block">{label}</span>
          <span className="text-[11px] text-stone-400 block mb-2">{range}</span>
        </div>
        <div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
            {config.label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl border border-rose-100">
              {food.image}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-stone-900">{food.name}</h3>
                {food.isAiAnalyzed && (
                  <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    ✨ AI Đã Bổ Sung
                  </span>
                )}
                <button
                  onClick={() => onToggleBookmark(food.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isBookmarked 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-white/80 text-stone-400 hover:text-rose-500 border border-stone-200'
                  }`}
                  title={isBookmarked ? 'Bỏ lưu món' : 'Lưu món ăn'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                </button>
              </div>
              {food.aliases && food.aliases.length > 0 && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Tên gọi khác: {food.aliases.join(', ')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Summary Alert */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-stone-800 text-sm leading-relaxed">
            <span className="font-bold text-rose-700">Tóm tắt khuyến nghị: </span>
            {food.summary}
          </div>

          {/* Trimester Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Đánh giá an toàn theo 3 giai đoạn mang thai
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {renderTrimesterBadge(food.statusT1, 'Tam cá nguyệt 1', 'Tuần 1 - 12 (3 tháng đầu)')}
              {renderTrimesterBadge(food.statusT2, 'Tam cá nguyệt 2', 'Tuần 13 - 27 (3 tháng giữa)')}
              {renderTrimesterBadge(food.statusT3, 'Tam cá nguyệt 3', 'Tuần 28 - 40 (3 tháng cuối)')}
            </div>
          </div>

          {/* Detailed Scientific Reason */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
            <h4 className="text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Cơ chế y khoa & Nguyên nhân
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">{food.reason}</p>
          </div>

          {/* Benefits & Risks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Benefits */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <h5 className="text-xs font-bold uppercase text-emerald-800 tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lợi ích dinh dưỡng
              </h5>
              <ul className="text-xs text-stone-700 space-y-1.5">
                {(Array.isArray(food.benefits) ? food.benefits : (food.benefits ? [food.benefits] : ['Cung cấp dinh dưỡng cần thiết'])).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <h5 className="text-xs font-bold uppercase text-rose-800 tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Nguy cơ nếu dùng sai
              </h5>
              <p className="text-xs text-stone-700 leading-relaxed">{food.risks}</p>
            </div>
          </div>

          {/* How to prepare & safe usage */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
            <h5 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-2 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-sky-600" />
              Hướng dẫn sơ chế & Lượng dùng an toàn
            </h5>
            <p className="text-xs text-stone-700 leading-relaxed">{food.advice}</p>
          </div>

          {/* Substitute Food */}
          {food.substitute && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block mb-0.5">Thực phẩm thay thế an toàn hơn:</span>
                <p className="text-xs text-stone-700">{food.substitute}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Dữ liệu tham khảo khuyến nghị từ Viện Dinh Dưỡng & ACOG.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

