import React, { useState } from 'react';
import { Utensils, Calendar, Sparkles, Printer, Check, Sun, Moon, Coffee, Heart, AlertCircle, RefreshCw, Flame, Award, Bot, Loader2, X, ChevronRight, Dices, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRIMESTER_INFO, WEEKLY_MENUS, SPECIAL_CONDITION_MENUS } from '../data/mealsData';
import { generateCustomMealPlanAI } from '../services/geminiService';

export default function MealPlanner({ initialTrimester = 't1' }) {
  const [activeStage, setActiveStage] = useState(initialTrimester); // 't1', 't2', 't3', 'special'
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Thứ 2, 6 = Chủ Nhật
  const [selectedSpecialCondition, setSelectedSpecialCondition] = useState('morning_sickness');

  // Random Filter State
  const [randomTrimester, setRandomTrimester] = useState('all'); // 'all', 't1', 't2', 't3'
  const [randomMealSlot, setRandomMealSlot] = useState('all'); // 'all', 'breakfast', 'snackMorning', 'lunch', 'snackAfternoon', 'dinner', 'snackNight'
  const [randomCondition, setRandomCondition] = useState('normal'); // 'normal', 'morning_sickness', 'gestational_diabetes', 'constipation', 'anemia'
  const [isRolling, setIsRolling] = useState(false);
  const [randomResult, setRandomResult] = useState(null);

  // AI Meal Generator state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiCustomMenu, setAiCustomMenu] = useState(null);
  const [aiFormData, setAiFormData] = useState({
    weeks: '16',
    conditions: 'Bình thường, hơi đầy hơi nhẹ',
    preferences: 'Thích ăn canh chua, cá béo, ít dầu mỡ',
    dislikes: 'Không ăn cay, sợ mùi hành sống'
  });

  const currentTrimesterInfo = TRIMESTER_INFO[activeStage] || TRIMESTER_INFO.t1;
  const currentWeekDays = WEEKLY_MENUS[activeStage] || WEEKLY_MENUS.t1;
  const currentDayPlan = currentWeekDays[selectedDayIndex] || currentWeekDays[0];

  // Meal slot labels map
  const mealSlotLabels = {
    all: 'Tất cả các bữa (Cả ngày)',
    breakfast: '🍳 Bữa Sáng',
    snackMorning: '🍎 Bữa Phụ Sáng',
    lunch: '🍲 Bữa Trưa',
    snackAfternoon: '🥑 Bữa Phụ Chiều',
    dinner: '🥗 Bữa Tối',
    snackNight: '🥛 Phụ Nhẹ Đêm'
  };

  // Condition labels map
  const conditionLabels = {
    normal: 'Cân bằng chuẩn (Mâm cơm gia đình)',
    morning_sickness: '🍋 Mẹ ốm nghén nặng (Giảm buồn nôn)',
    gestational_diabetes: '📉 Tiểu đường thai kỳ (Low GI)',
    constipation: '🥬 Táo bón & trĩ (Nhuận tràng)',
    anemia: '🩸 Thiếu máu thiếu sắt (Bổ máu)'
  };

  // Smart Random Dish / Menu Generator based on user criteria
  const handleSmartRandomRoll = () => {
    setIsRolling(true);

    setTimeout(() => {
      let result = null;

      // 1. If special condition is selected
      if (randomCondition !== 'normal') {
        const condObj = SPECIAL_CONDITION_MENUS.find(c => c.id === randomCondition) || SPECIAL_CONDITION_MENUS[0];
        
        if (randomMealSlot === 'all') {
          result = {
            mode: 'full-day',
            title: `Thực đơn ngày cho ${condObj.name}`,
            conditionName: condObj.name,
            tagline: condObj.tagline,
            trimesterLabel: 'Chế độ chuyên biệt',
            sampleDay: condObj.sampleDay,
            note: condObj.principles[0]
          };
        } else {
          // Specific meal
          const slotMap = {
            breakfast: condObj.sampleDay.breakfast,
            snackMorning: condObj.sampleDay.snackMorning,
            lunch: condObj.sampleDay.lunch,
            snackAfternoon: condObj.sampleDay.snackAfternoon,
            dinner: condObj.sampleDay.dinner,
            snackNight: condObj.sampleDay.snackNight
          };

          result = {
            mode: 'single-meal',
            mealSlotName: mealSlotLabels[randomMealSlot],
            dishText: slotMap[randomMealSlot] || condObj.sampleDay.lunch,
            title: `Món ăn cho ${condObj.name}`,
            conditionName: condObj.name,
            tagline: condObj.tagline,
            trimesterLabel: 'Chế độ chuyên biệt',
            note: condObj.principles[1] || condObj.principles[0]
          };
        }
      } else {
        // 2. Normal family menu filtered by trimester
        let daysPool = [];
        if (randomTrimester === 't1') {
          daysPool = WEEKLY_MENUS.t1;
        } else if (randomTrimester === 't2') {
          daysPool = WEEKLY_MENUS.t2;
        } else if (randomTrimester === 't3') {
          daysPool = WEEKLY_MENUS.t3;
        } else {
          daysPool = [...WEEKLY_MENUS.t1, ...WEEKLY_MENUS.t2, ...WEEKLY_MENUS.t3];
        }

        const pickedDay = daysPool[Math.floor(Math.random() * daysPool.length)];
        const trimesterName = (randomTrimester === 't1' || WEEKLY_MENUS.t1.includes(pickedDay))
          ? '3 Tháng Đầu (Tam cá nguyệt 1)'
          : (randomTrimester === 't2' || WEEKLY_MENUS.t2.includes(pickedDay))
          ? '3 Tháng Giữa (Tam cá nguyệt 2)'
          : '3 Tháng Cuối (Tam cá nguyệt 3)';

        if (randomMealSlot === 'all') {
          result = {
            mode: 'full-day',
            title: `${pickedDay.day} - ${pickedDay.title}`,
            trimesterLabel: trimesterName,
            conditionName: 'Cân bằng chuẩn',
            calorieEst: pickedDay.calorieEst,
            breakfast: pickedDay.breakfast,
            snackMorning: pickedDay.snackMorning,
            lunch: pickedDay.lunch,
            snackAfternoon: pickedDay.snackAfternoon,
            dinner: pickedDay.dinner,
            snackNight: pickedDay.snackNight,
            note: pickedDay.note
          };
        } else {
          result = {
            mode: 'single-meal',
            mealSlotName: mealSlotLabels[randomMealSlot],
            dishText: pickedDay[randomMealSlot],
            title: `${pickedDay.title}`,
            trimesterLabel: trimesterName,
            conditionName: 'Cân bằng chuẩn',
            calorieEst: pickedDay.calorieEst,
            note: pickedDay.note
          };
        }
      }

      setRandomResult(result);
      setIsRolling(false);

      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  // AI Generate Menu Handler
  const handleGenerateAiMenu = async () => {
    setAiGenerating(true);
    setAiError('');

    try {
      const result = await generateCustomMealPlanAI({
        weeks: `${aiFormData.weeks} tuần`,
        conditions: aiFormData.conditions,
        preferences: aiFormData.preferences,
        dislikes: aiFormData.dislikes
      });

      setAiCustomMenu(result);
      setIsAiModalOpen(false);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Không thể tạo thực đơn từ AI. Vui lòng thử lại sau.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-pink-50 p-6 sm:p-8 border border-emerald-100/90 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Utensils className="w-3.5 h-3.5" />
            <span>Thực đơn chuẩn Y khoa 7 ngày/tuần & AI Gemini</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            Gợi ý thực đơn theo từng giai đoạn mang thai
          </h2>
          <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">
            Mỗi giai đoạn thai kỳ (3 tháng đầu, 3 tháng giữa, 3 tháng cuối) đều có nhu cầu vi chất khác biệt. Mẹ có thể chọn thực đơn theo tuần, dùng <strong>vòng quay ngẫu nhiên theo tiêu chí</strong>, hoặc nhờ AI Gemini lên thực đơn cá nhân hóa.
          </p>

          {/* Quick Action buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-200 transition-all hover:scale-102 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>✨ AI Tạo Thực Đơn Riêng Cho Mẹ</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>In thực đơn ra giấy</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 text-9xl opacity-15 select-none pointer-events-none">
          🍲
        </div>
      </div>

      {/* SMART RANDOM MEAL PICKER SECTION (Theo thời gian mang thai, bữa và chế độ đặc biệt) */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center text-xl shadow-xs">
              🎲
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                Gợi Ý Món Ăn Ngẫu Nhiên Theo Tiêu Chí Của Mẹ
              </h3>
              <p className="text-xs text-stone-500">
                Chọn giai đoạn thai kỳ, bữa ăn và thể trạng để nhận ngay món ăn phù hợp
              </p>
            </div>
          </div>
        </div>

        {/* 3 Interactive Dropdowns / Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Thời gian mang thai */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              1. Thời gian mang thai:
            </label>
            <select
              value={randomTrimester}
              onChange={(e) => setRandomTrimester(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs sm:text-sm font-medium focus:border-rose-500 focus:outline-hidden"
            >
              <option value="all">🌟 Tất cả các giai đoạn</option>
              <option value="t1">🌱 3 Tháng Đầu (Tuần 1 - 12)</option>
              <option value="t2">🌿 3 Tháng Giữa (Tuần 13 - 27)</option>
              <option value="t3">🍎 3 Tháng Cuối (Tuần 28 - 40)</option>
            </select>
          </div>

          {/* 2. Bữa ăn */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              2. Bữa ăn trong ngày:
            </label>
            <select
              value={randomMealSlot}
              onChange={(e) => setRandomMealSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs sm:text-sm font-medium focus:border-rose-500 focus:outline-hidden"
            >
              <option value="all">🍽️ Cả ngày (Tất cả các bữa)</option>
              <option value="breakfast">🍳 Bữa Sáng (7:00 - 8:00)</option>
              <option value="snackMorning">🍎 Bữa Phụ Sáng (9:30 - 10:00)</option>
              <option value="lunch">🍲 Bữa Trưa (11:30 - 12:30)</option>
              <option value="snackAfternoon">🥑 Bữa Phụ Chiều (15:00 - 15:30)</option>
              <option value="dinner">🥗 Bữa Tối (18:30 - 19:30)</option>
              <option value="snackNight">🥛 Phụ Nhẹ Đêm (21:00)</option>
            </select>
          </div>

          {/* 3. Chế độ đặc biệt */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              3. Thể trạng / Chế độ:
            </label>
            <select
              value={randomCondition}
              onChange={(e) => setRandomCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs sm:text-sm font-medium focus:border-rose-500 focus:outline-hidden"
            >
              <option value="normal">🍚 Bình thường (Cân bằng chuẩn)</option>
              <option value="morning_sickness">🍋 Mẹ ốm nghén nặng (Dễ tiêu)</option>
              <option value="gestational_diabetes">📉 Tiểu đường thai kỳ (Low GI)</option>
              <option value="constipation">🥬 Táo bón & trĩ (Nhuận tràng)</option>
              <option value="anemia">🩸 Thiếu máu thiếu sắt (Bổ máu)</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Tiêu chí: <strong className="text-stone-800">{mealSlotLabels[randomMealSlot]}</strong> • <strong className="text-rose-600">{conditionLabels[randomCondition].split('(')[0]}</strong>
          </div>

          <button
            onClick={handleSmartRandomRoll}
            disabled={isRolling}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-rose-200 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
          >
            <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Đang quay món...' : 'Gợi Ý Món Ăn Ngay 🎲'}</span>
          </button>
        </div>

        {/* Display Random Result */}
        {randomResult && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-2 border-rose-200 shadow-md animate-in slide-in-from-top-3 duration-300 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {randomResult.trimesterLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {randomResult.conditionName}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-lg sm:text-xl mt-1">
                    {randomResult.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSmartRandomRoll}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  title="Chọn món khác với cùng tiêu chí"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Đổi món khác</span>
                </button>
                <button
                  onClick={() => setRandomResult(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Single Meal Mode */}
            {randomResult.mode === 'single-meal' && (
              <div className="p-4 rounded-xl bg-white/90 border border-rose-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                  {randomResult.mealSlotName}:
                </span>
                <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
                  {randomResult.dishText}
                </p>
                {randomResult.note && (
                  <p className="text-xs text-stone-500 pt-1 border-t border-stone-100 flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">💡 Gợi ý:</span>
                    <span>{randomResult.note}</span>
                  </p>
                )}
              </div>
            )}

            {/* Full Day Mode */}
            {randomResult.mode === 'full-day' && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/90 border border-rose-100">
                    <span className="font-bold text-amber-800 block mb-0.5">Sáng:</span>
                    <span className="text-stone-800 font-medium">{randomResult.breakfast || randomResult.sampleDay?.breakfast}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-rose-100">
                    <span className="font-bold text-emerald-800 block mb-0.5">Trưa:</span>
                    <span className="text-stone-800 font-medium">{randomResult.lunch || randomResult.sampleDay?.lunch}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-rose-100">
                    <span className="font-bold text-indigo-800 block mb-0.5">Tối:</span>
                    <span className="text-stone-800 font-medium">{randomResult.dinner || randomResult.sampleDay?.dinner}</span>
                  </div>
                </div>
                {randomResult.note && (
                  <p className="text-xs text-stone-600 mt-2 italic flex items-center gap-1">
                    <span>💡 Ghi chú dinh dưỡng:</span>
                    <span>{randomResult.note}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Generated Custom Menu Result Banner */}
      {aiCustomMenu && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  ✨ Thực Đơn Cá Nhân Hóa Do Google Gemini AI Thiết Kế
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  {aiCustomMenu.trimesterTag}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-1">{aiCustomMenu.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Năng lượng: {aiCustomMenu.calorieEst}</span>
              </span>
              <button
                onClick={() => setAiCustomMenu(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-white"
                title="Đóng thực đơn AI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-amber-800 uppercase block mb-1">🍳 Bữa Sáng:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.breakfast}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-orange-800 uppercase block mb-1">🍎 Phụ Sáng:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.snackMorning}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">🍲 Bữa Trưa:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.lunch}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-teal-800 uppercase block mb-1">🥑 Phụ Chiều:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.snackAfternoon}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">🥗 Bữa Tối:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.dinner}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-purple-100">
              <span className="text-xs font-bold text-purple-800 uppercase block mb-1">🥛 Phụ Đêm:</span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">{aiCustomMenu.snackNight}</p>
            </div>
          </div>

          {/* Doctor note */}
          <div className="p-4 rounded-2xl bg-purple-100/60 border border-purple-200 text-xs text-purple-900 leading-relaxed">
            <strong className="block mb-1 font-bold">🩺 Lời khuyên của Bác sĩ AI:</strong>
            {aiCustomMenu.doctorNote}
          </div>

          {/* Key nutrients */}
          {aiCustomMenu.keyNutrients && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-stone-500">Dưỡng chất trọng tâm:</span>
              {aiCustomMenu.keyNutrients.map((nut, i) => (
                <span key={i} className="text-xs bg-white text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl font-semibold">
                  {nut}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Primary Stage Switcher */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* T1 */}
        <button
          onClick={() => setActiveStage('t1')}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            activeStage === 't1'
              ? 'bg-rose-50 border-rose-500 shadow-md shadow-rose-100 ring-2 ring-rose-200'
              : 'bg-white border-stone-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">🌱</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              Tuần 1 - 12
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm">3 Tháng Đầu (T1)</h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">Giảm nghén, giàu Axit Folic</p>
        </button>

        {/* T2 */}
        <button
          onClick={() => setActiveStage('t2')}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            activeStage === 't2'
              ? 'bg-amber-50 border-amber-500 shadow-md shadow-amber-100 ring-2 ring-amber-200'
              : 'bg-white border-stone-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">🌿</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Tuần 13 - 27
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm">3 Tháng Giữa (T2)</h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">Phát triển Canxi & Não bộ</p>
        </button>

        {/* T3 */}
        <button
          onClick={() => setActiveStage('t3')}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            activeStage === 't3'
              ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-100 ring-2 ring-emerald-200'
              : 'bg-white border-stone-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">🍎</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Tuần 28 - 40
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm">3 Tháng Cuối (T3)</h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">Tăng cân chuẩn, chống táo bón</p>
        </button>

        {/* Special Condition */}
        <button
          onClick={() => setActiveStage('special')}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            activeStage === 'special'
              ? 'bg-purple-50 border-purple-500 shadow-md shadow-purple-100 ring-2 ring-purple-200'
              : 'bg-white border-stone-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">✨</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Chuyên biệt
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Chế Độ Đặc Biệt</h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">Ốm nghén, tiểu đường, thiếu máu</p>
        </button>
      </div>

      {/* Main Content Area based on Stage */}
      {activeStage === 'special' ? (
        /* SPECIAL CONDITION SECTION */
        <div className="space-y-6">
          {/* Sub-tab pills for special conditions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SPECIAL_CONDITION_MENUS.map((cond) => {
              const isSelected = selectedSpecialCondition === cond.id;
              return (
                <button
                  key={cond.id}
                  onClick={() => setSelectedSpecialCondition(cond.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{cond.icon}</span>
                  <span>{cond.name}</span>
                </button>
              );
            })}
          </div>

          {/* Condition Detail Card */}
          {(() => {
            const cond = SPECIAL_CONDITION_MENUS.find(c => c.id === selectedSpecialCondition) || SPECIAL_CONDITION_MENUS[0];
            return (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                    <span>{cond.icon}</span>
                    <span>{cond.tagline}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-stone-900">{cond.name}</h3>
                  <p className="text-sm text-stone-600 mt-1">{cond.target}</p>
                </div>

                {/* Principles */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    4 Nguyên Tắc Ăn Uống Cốt Lõi
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                    {cond.principles.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Day Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    Lịch trình bữa ăn mẫu chuẩn khoa học trong 1 ngày
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(cond.sampleDay).map(([mealKey, mealDesc], idx) => {
                      const icons = {
                        wakeUp: '🌅 Thức dậy',
                        breakfast: '🍳 Bữa sáng',
                        snackMorning: '🍎 Phụ sáng',
                        lunch: '🍲 Bữa trưa',
                        snackAfternoon: '🥑 Phụ chiều',
                        dinner: '🥗 Bữa tối',
                        snackNight: '🥛 Trước khi ngủ'
                      };
                      return (
                        <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                          <span className="text-xs font-bold text-stone-800 min-w-28 text-purple-700">
                            {icons[mealKey] || mealKey}
                          </span>
                          <span className="text-xs text-stone-700 leading-relaxed">{mealDesc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* TRIMESTER 1, 2, 3 SECTION */
        <div className="space-y-6">
          {/* Trimester Overview Header */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900">{currentTrimesterInfo.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentTrimesterInfo.badgeClass}`}>
                  {currentTrimesterInfo.weeks}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{currentTrimesterInfo.highlight}</p>
              <div className="text-xs text-stone-400 mt-0.5">
                Nhu cầu năng lượng: <strong className="text-stone-700">{currentTrimesterInfo.dailyCalories}</strong>
              </div>
            </div>

            {/* Nutrients Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {currentTrimesterInfo.keyNutrients.map((nut, i) => (
                <div key={i} className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px]">
                  <span className="font-bold text-stone-800 block">{nut.name}</span>
                  <span className="text-stone-500">{nut.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day of Week Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {currentWeekDays.map((d, index) => {
              const isSelected = selectedDayIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`flex-1 min-w-24 p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold">{d.day}</div>
                  <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                    {d.calorieEst}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Full Menu Details */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {currentDayPlan.day} • {currentTrimesterInfo.name}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-0.5">{currentDayPlan.title}</h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Năng lượng: ~{currentDayPlan.calorieEst}</span>
              </div>
            </div>

            {/* Meals Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bữa sáng */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-lg">
                  🍳
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Bữa Sáng (7:00 - 8:00)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.breakfast}</p>
                </div>
              </div>

              {/* Bữa phụ sáng */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 text-lg">
                  🍎
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-900 block mb-1">
                    Bữa Phụ Sáng (9:30 - 10:00)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.snackMorning}</p>
                </div>
              </div>

              {/* Bữa trưa */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-lg">
                  🍲
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                    Bữa Trưa (11:30 - 12:30)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.lunch}</p>
                </div>
              </div>

              {/* Bữa phụ chiều */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-lg">
                  🥑
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block mb-1">
                    Bữa Phụ Chiều (15:00 - 15:30)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.snackAfternoon}</p>
                </div>
              </div>

              {/* Bữa tối */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 text-lg">
                  🥗
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                    Bữa Tối (18:30 - 19:30)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.dinner}</p>
                </div>
              </div>

              {/* Bữa phụ tối */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 text-lg">
                  🥛
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-1">
                    Phụ Nhẹ Trước Ngủ (21:00)
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">{currentDayPlan.snackNight}</p>
                </div>
              </div>
            </div>

            {/* Day Note & Doctor tip */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
              <span className="text-rose-600 font-bold text-base">💡</span>
              <div>
                <strong className="text-rose-800">Lời khuyên dinh dưỡng trong ngày: </strong>
                {currentDayPlan.note}
              </div>
            </div>

            {/* General Trimester Doctor Tips list */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Lưu ý quan trọng của bác sĩ cho {currentTrimesterInfo.name}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-600">
                {currentTrimesterInfo.doctorTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">♥</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AI Meal Plan Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-purple-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-md">
                  ✨
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg">AI Tạo Thực Đơn Riêng Cho Mẹ</h3>
                  <p className="text-xs text-purple-700 font-medium">Sử dụng Google Gemini AI</p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-white/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-stone-700 block mb-1">1. Tuần thai hiện tại của mẹ:</label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={aiFormData.weeks}
                  onChange={(e) => setAiFormData(prev => ({ ...prev, weeks: e.target.value }))}
                  placeholder="Ví dụ: 16"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">2. Thể trạng / Triệu chứng hiện tại:</label>
                <input
                  type="text"
                  value={aiFormData.conditions}
                  onChange={(e) => setAiFormData(prev => ({ ...prev, conditions: e.target.value }))}
                  placeholder="Ví dụ: Ốm nghén nhiều, hoặc tiểu đường thai kỳ, táo bón..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">3. Sở thích món ăn / Yêu cầu dinh dưỡng:</label>
                <input
                  type="text"
                  value={aiFormData.preferences}
                  onChange={(e) => setAiFormData(prev => ({ ...prev, preferences: e.target.value }))}
                  placeholder="Ví dụ: Thích canh chua, cá béo, đồ luộc thanh mát..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">4. Món kiêng / Dị ứng (nếu có):</label>
                <input
                  type="text"
                  value={aiFormData.dislikes}
                  onChange={(e) => setAiFormData(prev => ({ ...prev, dislikes: e.target.value }))}
                  placeholder="Ví dụ: Sợ mùi tỏi sống, dị ứng cua ghẹ..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-stone-800"
                />
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                  {aiError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerateAiMenu}
                disabled={aiGenerating}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition-all cursor-pointer"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini đang lên thực đơn...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Thực Đơn Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
