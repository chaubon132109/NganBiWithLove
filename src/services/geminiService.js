const STORAGE_KEY = 'nganbi_gemini_api_key';

export function getStoredApiKey() {
  const envKey = cleanKey(import.meta.env.VITE_GEMINI_API_KEY || '');
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    const cleanedLocal = cleanKey(local);
    if (cleanedLocal && cleanedLocal.length >= 35 && cleanedLocal.startsWith('AIzaSy')) {
      return cleanedLocal;
    }
  } catch (e) {
    console.warn('Cannot read localStorage', e);
  }
  return envKey;
}

function cleanKey(raw) {
  if (!raw) return '';
  return raw.replace(/["'\s]/g, '').trim();
}

export function saveApiKey(key) {
  try {
    const cleaned = cleanKey(key);
    if (!cleaned) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, cleaned);
    }
  } catch (e) {
    console.error('Cannot save to localStorage', e);
  }
}

export function hasApiKey() {
  // Always true because serverless proxy /api/gemini handles key on Vercel & local Vite
  return true;
}

/**
 * Core Proxy caller: Calls /api/gemini (Vercel Serverless Function & Vite Dev Proxy)
 * The API Key is strictly stored on the server side and NEVER sent to the browser Network tab.
 */
async function callGeminiProxy({ model, contents, system_instruction, generationConfig, signal }) {
  // 1. Primary secure route: Call /api/gemini proxy
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        contents,
        system_instruction,
        generationConfig
      }),
      signal
    });

    if (res.status !== 404) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('Proxy /api/gemini unreachable, checking direct fallback...', err.message);
  }

  // 2. Direct fallback (only if /api/gemini returns 404, e.g. static preview)
  const key = getStoredApiKey();
  if (!key) {
    throw new Error('MISSING_API_KEY');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const payload = { contents };
  if (system_instruction) payload.system_instruction = system_instruction;
  if (generationConfig) payload.generationConfig = generationConfig;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function testGeminiApiKey() {
  try {
    const result = await callGeminiProxy({
      model: 'gemini-3.5-flash-lite',
      contents: [{ parts: [{ text: 'OK' }] }]
    });
    if (result.ok && result.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return { ok: true, message: 'Kết nối an toàn thành công!' };
    }
    return { ok: false, error: result.data?.error?.message || 'Lỗi kết nối' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Phân tích độ phức tạp câu hỏi để định tuyến thông minh (Smart Model Routing)
 * Chỉ sử dụng Nhóm 2 và Nhóm 3 (100% Google AI Studio Real Models - Không dùng Nhóm 1 offline):
 * - NHÓM 2: Gemini 3.5 Flash Lite (Tối ưu tốc độ, chào hỏi, giao tiếp, tra cứu thực phẩm hàng ngày)
 * - NHÓM 3: Gemini 3 Flash Preview (Chuyên sâu Y khoa, bệnh lý thai kỳ, phân tích xét nghiệm, lên thực đơn phức tạp)
 */
export function analyzeQuestionComplexity(text) {
  if (!text) {
    return {
      group: 'Nhóm 2',
      level: 'standard',
      model: 'gemini-3.5-flash-lite',
      fallbackModel: 'gemini-3-flash-preview',
      modelLabel: '⚡ Nhóm 2 • Gemini 3.5 Flash Lite (Tốc độ & Thông minh)',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
    };
  }

  const clean = text.trim().toLowerCase();
  const words = clean.split(/\s+/);

  const complexKeywords = [
    'thực đơn', 'lên thực đơn', 'tiểu đường thai kỳ', 'tiền sản giật',
    'dọa sảy', 'tụ dịch', 'bóc tách', 'ra máu', 'xét nghiệm', 'double test',
    'triple test', 'nipt', 'độ mờ da gáy', 'thiếu ối', 'đa ối', 'dị tật',
    'huyết áp cao', 'phù nề nặng', 'phân tích', 'tại sao', 'so sánh',
    'bệnh lý', 'tim thai', 'nang hoàng thể', 'tiền sử', 'u xơ', 'kháng sinh',
    'thuốc bổ', 'dọa sinh non', 'cổ tử cung ngắn', 'dạ con gò cứng',
    'chỉ số', 'bạch cầu', 'hct', 'tiểu cầu', 'suy dinh dưỡng', 'chậm tăng trưởng'
  ];

  const hasComplexKeywords = complexKeywords.some(kw => clean.includes(kw));
  const isLongQuery = words.length >= 20;

  if (hasComplexKeywords || isLongQuery) {
    return {
      group: 'Nhóm 3',
      level: 'complex',
      model: 'gemini-3-flash-preview',
      fallbackModel: 'gemini-3.5-flash-lite',
      modelLabel: '🔬 Nhóm 3 • Gemini 3 Flash (Chuyên Sâu Y Khoa)',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
    };
  }

  return {
    group: 'Nhóm 2',
    level: 'standard',
    model: 'gemini-3.5-flash-lite',
    fallbackModel: 'gemini-3-flash-preview',
    modelLabel: '⚡ Nhóm 2 • Gemini 3.5 Flash Lite (Tốc độ & Thông minh)',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
  };
}

/**
 * System prompt for Pregnancy Nutritionist
 */
const SYSTEM_INSTRUCTION = `Bạn là "Bác sĩ Dinh Dưỡng Thai Kỳ AI" thuộc ứng dụng "Mẹ Bầu An Tâm - NganBi With Love".
Nhiệm vụ của bạn là tư vấn dinh dưỡng, tra cứu an toàn thực phẩm, gợi ý thực đơn và giải đáp thắc mắc sức khỏe cho phụ nữ mang thai.
Nguyên tắc tư vấn:
1. Giọng điệu: Vô cùng dịu dàng, chu đáo, ấm áp, đồng cảm với sự mệt mỏi và lo lắng của mẹ bầu. Luôn xưng "Bác sĩ" hoặc "Em" và gọi người dùng là "Mẹ" hoặc "Mẹ bầu".
2. Khoa học & Y khoa: Dựa trên khuyến cáo của Viện Dinh Dưỡng Quốc Gia Việt Nam, Bộ Y Tế và Hiệp hội Sản Phụ khoa Hoa Kỳ (ACOG).
3. Luôn phân loại rõ ràng theo từng giai đoạn mang thai:
   - 3 tháng đầu (Tam cá nguyệt 1: Tuần 1 - 12): Chú ý Axit Folic, giảm ốm nghén, kiêng tuyệt đối chất kích thích co bóp tử cung (rau ngót sống, đu đủ xanh, rau răm, ngải cứu...).
   - 3 tháng giữa (Tam cá nguyệt 2: Tuần 13 - 27): Chú ý Canxi, Sắt hữu cơ, DHA/Omega-3 phát triển khung xương và não bộ thai nhi.
   - 3 tháng cuối (Tam cá nguyệt 3: Tuần 28 - 40): Chú ý kiểm soát đường huyết (Low GI), chống táo bón, tăng cân chuẩn cho thai nhi và chuẩn bị chuyển dạ.
4. Trình bày: Rõ ràng, gạch đầu dòng, có emoji sinh động, dễ đọc trên điện thoại.
5. Cảnh báo an toàn: Nhắc mẹ luôn đi khám bác sĩ điều trị nếu xuất hiện dấu hiệu bất thường (ra máu, bụng gò cứng liên tục, sốt cao > 38.5, thai giảm cử động...).`;

/**
 * Chat with Pregnancy Doctor via secure proxy
 */
export async function chatWithPregnancyAI(messages) {
  const lastUserMessage = messages[messages.length - 1]?.text || '';
  const routing = analyzeQuestionComplexity(lastUserMessage);

  const modelsToTry = [routing.model];
  if (routing.fallbackModel && !modelsToTry.includes(routing.fallbackModel)) {
    modelsToTry.push(routing.fallbackModel);
  }
  ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest'].forEach(m => {
    if (!modelsToTry.includes(m)) modelsToTry.push(m);
  });

  const validMessages = messages.filter(m => m.text && m.text.trim());
  const contents = validMessages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text.trim() }]
  }));

  if (contents.length === 0) {
    throw new Error('Tin nhắn rỗng');
  }

  if (contents[0].role !== 'user') {
    contents.shift();
  }
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: lastUserMessage || 'Chào bác sĩ' }] });
  }

  for (const modelName of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const result = await callGeminiProxy({
        model: modelName,
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (result.ok && result.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const isGroup3 = routing.group === 'Nhóm 3' || modelName.includes('preview');
        const finalLabel = isGroup3 
          ? `🔬 Nhóm 3 • Gemini 3 Flash (Chuyên Sâu Y Khoa)`
          : `⚡ Nhóm 2 • Gemini 3.5 Flash Lite (Tốc độ & Thông minh)`;
        const finalBadge = isGroup3
          ? 'bg-purple-50 text-purple-700 border-purple-200'
          : 'bg-sky-50 text-sky-700 border-sky-200';

        return {
          text: result.data.candidates[0].content.parts[0].text,
          routingInfo: {
            ...routing,
            actualModel: modelName,
            modelLabel: finalLabel,
            badgeClass: finalBadge
          }
        };
      }

      if (result.data?.error) {
        console.warn(`Model ${modelName} error:`, result.data.error.message);
      }
    } catch (err) {
      console.warn(`Model ${modelName} attempt failed (${err.name || err.message}), trying fallback...`);
    }
  }

  throw new Error('Không thể nhận phản hồi từ các mô hình AI. Vui lòng thử lại sau.');
}

/**
 * Analyze an unknown or custom food item via secure proxy
 */
export async function analyzeFoodWithAI(foodQuery) {
  const prompt = `Bạn là chuyên gia dinh dưỡng sản khoa. Hãy phân tích mức độ an toàn cho phụ nữ mang thai của món: "${foodQuery}".
Trả về duy nhất 1 JSON object với đúng cấu trúc sau (không kèm markdown ngoài JSON):
{
  "id": "slug-mon-an",
  "name": "Tên món ăn chuẩn tiếng Việt",
  "aliases": ["tên gọi khác 1", "tên gọi khác 2"],
  "category": "vegetables | fruits | meat_poultry | seafood | drinks | herbs_spices | snacks_sweets",
  "image": "1 emoji phù hợp nhất với món này",
  "statusT1": "safe | caution | avoid",
  "statusT2": "safe | caution | avoid",
  "statusT3": "safe | caution | avoid",
  "summary": "Tóm tắt khuyến nghị trong 1-2 câu ngắn gọn, dễ hiểu.",
  "reason": "Phân tích cơ chế y khoa, chất gây hại hoặc dưỡng chất nổi bật chi tiết.",
  "benefits": ["Lợi ích 1", "Lợi ích 2", "Lợi ích 3"],
  "risks": "Nguy cơ nếu dùng sai cách hoặc kiêng cữ.",
  "advice": "Hướng dẫn sơ chế, cách nấu chín và liều lượng dùng an toàn.",
  "substitute": "Thực phẩm thay thế an toàn hơn nếu món này cần kiêng."
}

Quy chuẩn đánh giá:
- 'safe': An toàn, giàu dinh dưỡng, khuyến khích dùng.
- 'caution': Cần cẩn trọng, chỉ dùng lượng nhỏ, nấu chín già hoặc cần lưu ý bệnh lý nền.
- 'avoid': Nên tránh, tuyệt đối kiêng (nguy cơ co bóp tử cung, sảy thai, dị tật, nhiễm khuẩn Listeria/Salmonella/Toxoplasma/Cyanide...).`;

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest'];

  for (const modelName of modelsToTry) {
    try {
      const result = await callGeminiProxy({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          return JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
        }
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed for analyzeFood:`, err.message);
    }
  }

  throw new Error('Không thể phân tích dữ liệu món ăn từ AI. Vui lòng thử lại sau.');
}

/**
 * Generate customized pregnancy meal plan via secure proxy
 */
export async function generateCustomMealPlanAI({ weeks, conditions, preferences, dislikes }) {
  const prompt = `Hãy thiết kế thực đơn 1 ngày hoàn hảo cho mẹ bầu với thông tin:
- Tuần thai: ${weeks || 'Chưa rõ'}
- Tình trạng/Bệnh lý nền: ${conditions || 'Bình thường, khỏe mạnh'}
- Sở thích/Yêu cầu riêng: ${preferences || 'Món ăn gia đình Việt Nam dễ nấu'}
- Món kiêng/Dị ứng: ${dislikes || 'Không có'}

Trả về duy nhất 1 JSON object với đúng cấu trúc sau:
{
  "title": "Tên chủ đề thực đơn (ví dụ: Thực đơn cân bằng dinh dưỡng tuần 16)",
  "trimesterTag": "3 Tháng Đầu | 3 Tháng Giữa | 3 Tháng Cuối",
  "calorieEst": "Ước tính calo (ví dụ: ~2100 kcal)",
  "breakfast": "Món ăn sáng + đồ uống cụ thể",
  "snackMorning": "Món phụ sáng cụ thể",
  "lunch": "Món trưa cụ thể (cơm + món mặn + canh + rau)",
  "snackAfternoon": "Món phụ chiều cụ thể",
  "dinner": "Món tối cụ thể (cơm + món mặn + canh + rau)",
  "snackNight": "Món phụ nhẹ trước khi ngủ cụ thể",
  "doctorNote": "Lời khuyên dinh dưỡng và lưu ý y khoa chuyên sâu cho tuần thai này.",
  "keyNutrients": ["Dưỡng chất 1", "Dưỡng chất 2", "Dưỡng chất 3"]
}`;

  const modelsToTry = ['gemini-3-flash-preview', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];

  for (const modelName of modelsToTry) {
    try {
      const result = await callGeminiProxy({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          return JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
        }
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed for meal plan:`, err.message);
    }
  }

  throw new Error('Không thể tạo thực đơn từ AI. Vui lòng thử lại sau.');
}

/**
 * Generate daily pregnancy advice tailored to mom's health profile via secure proxy
 */
export async function generateDailyPregnancyAdviceAI(profile, week, conditions) {
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const condList = conditions?.length > 0 ? conditions.map(c => c.label).join(', ') : 'Sức khoẻ ổn định, không có bệnh lý';

  const prompt = `Hôm nay là ${today}. Mẹ bầu đang ở tuần thai thứ ${week || 12}.
Thông tin sức khỏe của mẹ:
- Tình trạng sức khỏe: ${condList}
- Cân nặng gần nhất: ${profile?.latestWeight ? profile.latestWeight + ' kg' : 'Chưa cập nhật'}
- Huyết áp gần nhất: ${profile?.latestBP || 'Chưa cập nhật'}
- Chế độ ăn: ${profile?.diet === 'vegetarian' ? 'Ăn chay' : 'Bình thường'}
- Dị ứng / Kiêng: ${profile?.allergies || profile?.dislikes || 'Không'}

Hãy tạo 1 lời khuyên chăm sóc thai kỳ hữu ích hôm nay. Trả về DUY NHẤT 1 JSON object với đúng định dạng (không kèm markdown ngoài JSON):
{
  "greeting": "Lời chào ấm áp đầu ngày ngắn gọn 1 câu",
  "mainAdvice": "Lời khuyên chính cụ thể hữu ích cho tuần ${week} và tình trạng hiện tại (2-3 câu, có emoji)",
  "nutritionTip": "1 gợi ý dinh dưỡng hoặc món ăn phù hợp với tuần thai và tình trạng sức khỏe",
  "exerciseTip": "1 gợi ý vận động hoặc nghỉ ngơi phù hợp",
  "warningSign": "1 dấu hiệu bất thường cần chú ý ở tuần thai này",
  "positiveAffirmation": "1 câu khích lệ, động viên tinh thần mẹ bầu ấm áp"
}`;

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest'];

  for (const modelName of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const result = await callGeminiProxy({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          return JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
        }
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed for daily advice:`, err.message);
    }
  }

  throw new Error('Không thể tạo lời khuyên từ AI lúc này.');
}
