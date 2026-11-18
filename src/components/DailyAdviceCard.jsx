import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Heart, Loader2, AlertTriangle, ChevronRight, User } from 'lucide-react';
import {
  getHealthProfile,
  calcCurrentPregnancyWeek,
  getTrimesterLabel,
  getActiveConditions,
  getDailyAdviceCache,
  saveDailyAdviceCache,
} from '../utils/healthProfileStorage';
import { generateDailyPregnancyAdviceAI, hasApiKey } from '../services/geminiService';

function getDefaultAdviceForWeek(week, profile) {
  const w = week || 12;
  const name = profile?.momName ? `Mẹ ${profile.momName}` : 'Mẹ bầu';

  if (w <= 12) {
    return {
      greeting: `Chào ${name}! Chúc hai mẹ con một ngày mới thật nhiều năng lượng và bình an ❤️`,
      mainAdvice: `Giai đoạn tuần ${w} là lúc hoàng thể phát triển mạnh mẽ và bé đang hình thành các cơ quan trọng yếu. Mẹ hãy ưu tiên nghỉ ngơi, chia nhỏ bữa ăn 5-6 lần/ngày để giảm cảm giác buồn nôn nhé.`,
      nutritionTip: 'Bổ sung đầy đủ 400-600mcg Axit Folic mỗi ngày (từ rau lá xanh đậm, ngũ cốc, bơ) và uống từng ngụm nước ấm nhỏ.',
      exerciseTip: 'Đi dạo nhẹ nhàng 15-20 phút nơi thoáng đãng hoặc tập hít thở sâu, tránh vận động mạnh.',
      warningSign: 'Nếu xuất hiện đau quặn bụng dưới kèm ra máu tươi hoặc nghén nôn kiệt sức không uống được nước, hãy đến cơ sở y tế ngay.',
      positiveAffirmation: 'Mẹ đang làm rất tốt hành trình kỳ diệu đón chào thiên thần nhỏ!'
    };
  }

  if (w <= 27) {
    return {
      greeting: `Chào ${name}! Hôm nay là một ngày tuyệt vời của tam cá nguyệt thứ 2 ❤️`,
      mainAdvice: `Tuần ${w} là giai đoạn "vàng" phát triển khung xương, thính giác và não bộ của bé. Mẹ nhớ uống bổ sung Canxi cách xa Sắt ít nhất 2 tiếng để cơ thể hấp thu tối ưu nhất nhé!`,
      nutritionTip: 'Tăng cường thực phẩm giàu canxi và DHA: sữa chua, phô mai tiệt trùng, cá hồi nấu chín, các loại hạt óc chó, hạnh nhân.',
      exerciseTip: 'Duy trì bơi lội nhẹ hoặc yoga bầu giúp giảm mỏi lưng và tăng tuần hoàn máu tới bánh nhau.',
      warningSign: 'Chú ý cảm nhận thai máy đều đặn sau mỗi bữa ăn và kiểm tra huyết áp định kỳ.',
      positiveAffirmation: 'Bé yêu đang lớn lên từng ngày khỏe mạnh bên trong mẹ!'
    };
  }

  return {
    greeting: `Chào ${name}! Hai mẹ con đã đi được chặng đường thật kỳ diệu đến tuần ${w} ❤️`,
    mainAdvice: `Những tuần cuối thai kỳ bụng đã nặng hơn, mẹ hãy tập thói quen nằm nghiêng sang bên trái và kê gối dưới bụng/đùi để tử cung không chèn ép tĩnh mạch chủ dưới, giúp máu nuôi bé tốt nhất.`,
    nutritionTip: 'Ăn nhiều chất xơ từ khoai lang, yến mạch, thanh long và uống đủ 2-2.5 lít nước ấm để phòng ngừa táo bón và trĩ thai kỳ.',
    exerciseTip: 'Tập các bài thở chuyển dạ nhẹ nhàng, xoay khớp háng hoặc ngồi trên bóng tập sinh để vùng chậu dẻo dai.',
    warningSign: 'Theo dõi cử động thai (ít nhất 4 lần cử động trong 1 giờ khi nghỉ ngơi), cơn gò tử cung đều đặn hoặc rỉ ối.',
    positiveAffirmation: 'Chỉ còn một chút nữa thôi, mẹ và thiên thần nhỏ sắp được ôm nhau rồi!'
  };
}

export default function DailyAdviceCard({ onNavigate }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [week, setWeek] = useState(null);

  const loadProfileAndAdvice = useCallback(async (forceRefresh = false) => {
    const p = getHealthProfile();
    setProfile(p);
    const w = calcCurrentPregnancyWeek(p);
    setWeek(w);

    // If no profile set up yet, skip fetching AI advice
    if (!p.dueDate && !p.lmpDate && !p.currentWeeks) return;
    if (!w) return;

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cache = getDailyAdviceCache();
      if (cache && cache.week === w) {
        setAdvice(cache.advice);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const conditions = getActiveConditions(p);
      const parsed = await generateDailyPregnancyAdviceAI(p, w, conditions);

      if (parsed && parsed.mainAdvice) {
        setAdvice(parsed);
        saveDailyAdviceCache({ advice: parsed, week: w });
      } else {
        const fallback = getDefaultAdviceForWeek(w, p);
        setAdvice(fallback);
      }
    } catch (err) {
      console.warn('Using standard medical daily advice fallback:', err.message);
      // Fallback seamlessly so mom always receives thoughtful, medical daily advice
      const fallback = getDefaultAdviceForWeek(w, p);
      setAdvice(fallback);
      saveDailyAdviceCache({ advice: fallback, week: w });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileAndAdvice(false);
  }, [loadProfileAndAdvice]);

  // No profile → show setup prompt
  if (!profile || (!profile.dueDate && !profile.lmpDate && !profile.currentWeeks)) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-3xl border border-rose-100 p-6 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-3xl shadow-sm shrink-0">
            👩‍⚕️
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base">Hồ sơ sức khoẻ của mẹ chưa được thiết lập</h3>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              Nhập tuần thai và tình trạng sức khoẻ để nhận <strong>lời khuyên dinh dưỡng hàng ngày</strong> được cá nhân hoá riêng cho mẹ nhé! 💕
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('health-profile')}
          className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 flex items-center gap-1.5 hover:from-rose-600 hover:to-pink-600 transition-all whitespace-nowrap"
        >
          <User className="w-3.5 h-3.5" />
          Thiết lập ngay
        </button>
      </div>
    );
  }

  const conditions = getActiveConditions(profile);
  const trimLabel = getTrimesterLabel(week);
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
      {/* Header strip */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold text-sm">Lời Khuyên Hôm Nay</span>
          <span className="text-rose-200 text-xs">• {today}</span>
        </div>
        <div className="flex items-center gap-2">
          {week && (
            <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">
              Tuần {week} • {week <= 12 ? '3T Đầu' : week <= 27 ? '3T Giữa' : '3T Cuối'}
            </span>
          )}
          <button
            onClick={() => loadProfileAndAdvice(true)}
            disabled={loading}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Làm mới lời khuyên"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Loading state */}
        {loading && !advice && (
          <div className="flex items-center gap-3 text-stone-500 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-rose-500 shrink-0" />
            <span className="text-sm">Bác sĩ AI đang chuẩn bị lời khuyên hôm nay cho mẹ...</span>
          </div>
        )}

        {/* Error state */}
        {error && !advice && (
          <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Advice content */}
        {advice && (
          <div className="space-y-3">
            {/* Greeting */}
            {advice.greeting && (
              <p className="font-semibold text-rose-700 text-sm">{advice.greeting}</p>
            )}

            {/* Main advice */}
            {advice.mainAdvice && (
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
                <p className="text-sm text-stone-700 leading-relaxed">{advice.mainAdvice}</p>
              </div>
            )}

            {/* 3-col tips grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {advice.nutritionTip && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <div className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">🥗 Dinh dưỡng</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{advice.nutritionTip}</p>
                </div>
              )}
              {advice.exerciseTip && (
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                  <div className="text-xs font-bold text-sky-700 mb-1 flex items-center gap-1">🧘 Vận động</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{advice.exerciseTip}</p>
                </div>
              )}
              {advice.warningSign && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <div className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">⚠️ Lưu ý</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{advice.warningSign}</p>
                </div>
              )}
            </div>

            {/* Affirmation */}
            {advice.positiveAffirmation && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
                <Heart className="w-4 h-4 shrink-0 fill-rose-400 text-rose-400" />
                <span className="italic font-medium">{advice.positiveAffirmation}</span>
              </div>
            )}
          </div>
        )}

        {/* No API → no AI advice yet but show profile summary */}
        {!loading && !advice && !error && week && (
          <div className="text-center py-2 text-sm text-stone-500">
            <span>Mẹ đang ở </span>
            <strong className="text-rose-600">Tuần {week}</strong>
            <span> • {trimLabel}</span>
            {conditions.length > 0 && (
              <span className="block mt-1 text-xs text-amber-600">
                Tình trạng theo dõi: {conditions.map(c => c.label).join(' • ')}
              </span>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1 border-t border-rose-100">
          <button
            onClick={() => onNavigate('health-profile')}
            className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            Cập nhật hồ sơ sức khoẻ
          </button>
          {conditions.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {conditions.slice(0, 3).map(c => (
                <span key={c.key} className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                  {c.label}
                </span>
              ))}
              {conditions.length > 3 && (
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">+{conditions.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
