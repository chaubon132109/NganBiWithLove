import React, { useState } from 'react';
import { Calendar, Baby, Sparkles, Heart, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function PregnancyCalculator({ onSelectTrimester }) {
  const [calcMode, setCalcMode] = useState('lmp'); // 'lmp' (Kỳ kinh cuối) or 'dueDate' (Ngày dự sinh)
  const [inputDate, setInputDate] = useState(() => {
    // Default to ~10 weeks ago for a realistic demo
    const d = new Date();
    d.setDate(d.getDate() - 70);
    return d.toISOString().split('T')[0];
  });

  // Calculate gestational age
  const calculatePregnancy = () => {
    if (!inputDate) return null;
    const now = new Date();
    const target = new Date(inputDate);

    let days = 0;
    let dueDate = null;

    if (calcMode === 'lmp') {
      const diffMs = now.getTime() - target.getTime();
      days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      // Due date is LMP + 280 days
      dueDate = new Date(target.getTime() + 280 * 24 * 60 * 60 * 1000);
    } else {
      // Due date provided
      dueDate = target;
      const totalDays = 280;
      const diffToDueMs = target.getTime() - now.getTime();
      const daysToDue = Math.floor(diffToDueMs / (1000 * 60 * 60 * 24));
      days = totalDays - daysToDue;
    }

    if (days < 0 || days > 300) {
      return null;
    }

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    let trimester = 't1';
    let trimesterName = 'Tam cá nguyệt 1 (3 tháng đầu)';
    if (weeks >= 28) {
      trimester = 't3';
      trimesterName = 'Tam cá nguyệt 3 (3 tháng cuối)';
    } else if (weeks >= 13) {
      trimester = 't2';
      trimesterName = 'Tam cá nguyệt 2 (3 tháng giữa)';
    }

    // Cute baby size comparison
    const sizeMap = [
      { maxWeek: 4, size: 'Hạt vừng nhỏ xíu 🌰', desc: 'Trứng thụ tinh làm tổ an toàn trong niêm mạc tử cung.' },
      { maxWeek: 6, size: 'Hạt đậu lăng 🌱', desc: 'Trái tim nhỏ bé của con đã bắt đầu đập những nhịp đầu tiên.' },
      { maxWeek: 8, size: 'Quả mâm xôi (Phúc bồn tử) 🍓', desc: 'Mầm tay chân và các ngón tí hon đang dần hình thành.' },
      { maxWeek: 10, size: 'Quả quất / Quả dâu tây 🍓', desc: 'Bé đã bắt đầu có cử động gập duỗi nhẹ nhàng.' },
      { maxWeek: 12, size: 'Quả chanh vàng 🍋', desc: 'Hoàn thiện các cơ quan chính, hệ thần kinh cơ bản khép kín.' },
      { maxWeek: 16, size: 'Quả bơ sáp 🥑', desc: 'Bé biết nuốt nước ối và chớp mắt, khung xương phát triển.' },
      { maxWeek: 20, size: 'Quả xoài cát / Quả chuối 🥭', desc: 'Mẹ bắt đầu cảm nhận rõ những cú đạp đầu tiên (máy thai).' },
      { maxWeek: 24, size: 'Bắp ngô ngọt 🌽', desc: 'Tai bé đã nghe được giọng nói trầm ấm của ba và tiếng tim mẹ.' },
      { maxWeek: 28, size: 'Cây súp lơ tím / Cà tím 🍆', desc: 'Bé mở mắt, não bộ phát triển các nếp nhăn neuron thần kinh.' },
      { maxWeek: 32, size: 'Quả bí ngô / Quả dưa hấu nhỏ 🎃', desc: 'Lớp mỡ dưới da dày lên giúp bé tròn trịa, tăng cân nhanh.' },
      { maxWeek: 36, size: 'Quả đu đủ lớn / Trái dừa 🥥', desc: 'Phổi bé dần hoàn thiện, chuẩn bị sẵn sàng cho hơi thở đầu đời.' },
      { maxWeek: 42, size: 'Quả dưa hấu tròn trĩnh 🍉', desc: 'Bé yêu đã sẵn sàng chào đời trong vòng tay yêu thương của mẹ!' }
    ];

    const currentComparison = sizeMap.find(item => weeks <= item.maxWeek) || sizeMap[sizeMap.length - 1];

    return {
      weeks,
      remainingDays,
      trimester,
      trimesterName,
      dueDate: dueDate.toLocaleDateString('vi-VN'),
      sizeComparison: currentComparison
    };
  };

  const result = calculatePregnancy();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Tính tuổi thai & Khuyến nghị dinh dưỡng
            </h2>
            <p className="text-xs text-stone-500">
              Nhập ngày để biết bé yêu đang ở tuần thứ mấy và nhận thực đơn chuẩn xác nhất.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
              Tính theo phương pháp:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCalcMode('lmp')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  calcMode === 'lmp'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Kỳ kinh cuối (LMP)
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('dueDate')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  calcMode === 'dueDate'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Ngày dự sinh
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
              {calcMode === 'lmp' ? 'Ngày đầu của kỳ kinh cuối cùng:' : 'Ngày dự sinh (siêu âm 12 tuần):'}
            </label>
            <div className="relative">
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:border-rose-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result ? (
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-3xl border-2 border-rose-200/90 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-3">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Kết quả tính toán
              </span>
              <h3 className="text-3xl font-extrabold text-stone-900 mt-1">
                {result.weeks} tuần {result.remainingDays > 0 ? `+ ${result.remainingDays} ngày` : ''}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                Giai đoạn: <strong className="text-rose-700">{result.trimesterName}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-200 text-right sm:text-right">
              <span className="text-[11px] text-stone-500 block">Ngày dự sinh ước tính:</span>
              <span className="text-sm font-bold text-stone-800">{result.dueDate}</span>
            </div>
          </div>

          {/* Baby Size Milestone */}
          <div className="p-5 rounded-2xl bg-white/80 border border-rose-100 flex items-start gap-4">
            <div className="text-4xl shrink-0 p-2 bg-rose-50 rounded-2xl border border-rose-100">
              👶
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                Kích thước bé yêu tuần này:
              </span>
              <h4 className="text-lg font-bold text-stone-900">{result.sizeComparison.size}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {result.sizeComparison.desc}
              </p>
            </div>
          </div>

          {/* One click button to View Meal Plan */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-stone-600">
              Thực đơn dinh dưỡng đã sẵn sàng cho giai đoạn <strong className="text-stone-800">{result.weeks} tuần</strong> của mẹ.
            </div>

            <button
              onClick={() => onSelectTrimester(result.trimester)}
              className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all hover:scale-102"
            >
              <span>Xem ngay thực đơn tuần này</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-sm">
          Vui lòng chọn ngày hợp lệ để tính tuổi thai.
        </div>
      )}
    </div>
  );
}

