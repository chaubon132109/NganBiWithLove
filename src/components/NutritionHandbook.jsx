import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, AlertOctagon, HelpCircle, ShieldAlert } from 'lucide-react';
import { ESSENTIAL_NUTRIENTS, PREGNANCY_MYTHS } from '../data/nutritionGuide';

export default function NutritionHandbook() {
  const [activeTab, setActiveTab] = useState('nutrients'); // 'nutrients', 'myths', 'redflags'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cẩm nang sản khoa & Giải đáp khoa học</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Cẩm Nang Vi Chất & Gỡ Rối Dân Gian
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Tổng hợp kiến thức vi chất thiết yếu, vạch trần các tin đồn kiêng khem sai lầm và các dấu hiệu cảnh báo khẩn cấp cần đến bệnh viện ngay.
        </p>

        {/* Navigation Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('nutrients')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'nutrients'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            6 Nhóm Vi Chất Vàng
          </button>
          <button
            onClick={() => setActiveTab('myths')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'myths'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Gỡ Rối Quan Niệm Dân Gian
          </button>
          <button
            onClick={() => setActiveTab('redflags')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'redflags'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            🚨 Dấu Hiệu Cảnh Báo Khẩn Cấp
          </button>
        </div>
      </div>

      {/* CONTENT: NUTRIENTS */}
      {activeTab === 'nutrients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ESSENTIAL_NUTRIENTS.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-stone-900 text-base">{item.name}</h3>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {item.amount}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  <strong className="text-stone-800">Tầm quan trọng: </strong>
                  {item.importance}
                </p>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 mb-3">
                  <strong className="text-stone-800 block mb-1">Nguồn thực phẩm dồi dào:</strong>
                  {item.sources}
                </div>
              </div>
              <div className="text-[11px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
                <span className="font-bold">💡 Lưu ý:</span>
                <span>{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: MYTHS */}
      {activeTab === 'myths' && (
        <div className="space-y-4">
          {PREGNANCY_MYTHS.map((myth, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <h3 className="font-bold text-stone-900 text-base">"{myth.myth}"</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  {myth.verdict}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block mb-0.5">Sự thật chuẩn y khoa:</strong>
                  {myth.fact}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: RED FLAGS */}
      {activeTab === 'redflags' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-rose-300 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-rose-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl">
              🚨
            </div>
            <div>
              <h3 className="text-xl font-bold text-rose-900">
                Các Dấu Hiệu Nguy Hiểm Cần Đến Bệnh Viện Sản Ngay Lập Tức
              </h3>
              <p className="text-xs text-stone-500">
                Không chần chừ hay tự ý dùng thuốc tại nhà khi xuất hiện các triệu chứng dưới đây.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                1. Ra máu âm đạo bất thường
              </div>
              <p className="text-stone-600 text-xs">
                Máu đỏ tươi hoặc máu cục kèm đau bụng, dù lượng ít hay nhiều ở bất kỳ giai đoạn thai kỳ nào.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                2. Đau bụng dưới dữ dội hoặc quặn từng cơn
              </div>
              <p className="text-stone-600 text-xs">
                Bụng gò cứng liên tục, đau quặn thắt tăng dần không đỡ sau khi nghỉ ngơi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                3. Rỉ ối hoặc vỡ ối sớm
              </div>
              <p className="text-stone-600 text-xs">
                Nước chảy ra từ âm đạo có mùi tanh nhẹ, không kiểm soát được bằng cơ thắt niệu đạo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                4. Thai giảm hoặc ngừng cử động (máy thai)
              </div>
              <p className="text-stone-600 text-xs">
                Từ tuần 28 trở đi, nếu bé đạp dưới 10 cử động trong vòng 2 giờ đếm khi mẹ nằm nghỉ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                5. Nhức đầu dữ dội, hoa mắt, nhìn mờ
              </div>
              <p className="text-stone-600 text-xs">
                Kèm phù nề mặt và mu bàn chân đột ngột – dấu hiệu cảnh báo tiền sản giật cấp tính.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                6. Sốt cao trên 38.5°C kèm rét run
              </div>
              <p className="text-stone-600 text-xs">
                Nhiễm trùng cấp tính có thể gây kích thích chuyển dạ sinh non hoặc dị tật nếu sốt kéo dài.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

