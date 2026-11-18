import React from 'react';
import { X, Trash2, ArrowRight, Bookmark } from 'lucide-react';
import { SAFETY_LEVELS } from '../data/foodsData';
import { getAllFoodsList } from '../utils/customFoodsStorage';

export default function BookmarksDrawer({ isOpen, onClose, bookmarks, onToggleBookmark, onSelectFood }) {
  if (!isOpen) return null;

  const allFoods = getAllFoodsList();
  const bookmarkedFoods = allFoods.filter(food => bookmarks.includes(food.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-stone-900 text-base">Món ăn đã lưu ({bookmarkedFoods.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {bookmarkedFoods.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <span className="text-4xl block mb-2">🔖</span>
              <p className="text-sm">Chưa có món nào được lưu.</p>
              <p className="text-xs text-stone-400 mt-1">
                Bấm vào biểu tượng bookmark trên thẻ món ăn để lưu lại xem nhanh.
              </p>
            </div>
          ) : (
            bookmarkedFoods.map((food) => {
              return (
                <div
                  key={food.id}
                  onClick={() => {
                    onSelectFood(food.id);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-rose-50/40 border border-stone-200/80 hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{food.image}</span>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-600 transition-colors">
                        {food.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{food.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(food.id);
                      }}
                      className="p-1.5 text-stone-300 hover:text-rose-500 rounded-full transition-colors"
                      title="Bỏ lưu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-rose-600 transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

