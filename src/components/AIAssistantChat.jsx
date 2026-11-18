import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, Heart, ShieldCheck, HelpCircle, Zap, Cpu } from 'lucide-react';
import { chatWithPregnancyAI } from '../services/geminiService';

export default function AIAssistantChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      isWelcome: true,
      text: `Chào mẹ yêu! ❤️ Em là **Bác Sĩ Dinh Dưỡng Thai Kỳ AI** (Powered by Google Gemini).

Em luôn túc trực 24/7 để đồng hành và chăm sóc cho mẹ và bé:
- 🔍 **Tra cứu món ăn:** Tuần thai hiện tại có ăn được món này không? Lượng ăn bao nhiêu là an toàn?
- 🥗 **Gợi ý thực đơn cá nhân hóa:** Dành cho mẹ nghén nặng, tiểu đường thai kỳ, thiếu máu, táo bón...
- 💡 **Giải đáp băn khoăn:** Lỡ ăn phải món kiêng, mẹo giảm nghén, cách sơ chế đúng chuẩn Y khoa.

Mẹ đang quan tâm điều gì hôm nay, hãy nhắn cho em nhé! 👇`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      modelLabel: '⚡ Bác sĩ Dinh Dưỡng Thai Kỳ AI Sẵn Sàng (Nhóm 2 & Nhóm 3)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopiedId, setIsCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Tuần 8 em bị nghén nặng sợ mùi thức ăn, nên ăn uống thế nào?',
    'Em lỡ ăn 1 miếng chả lá lốt ở 3 tháng đầu có nguy hiểm không?',
    'Thực đơn 3 ngày cho mẹ bầu tiểu đường thai kỳ tuần 24',
    'Một tuần mẹ bầu nên ăn bao nhiêu quả trứng gà là chuẩn?',
    'Thực phẩm nào giúp thai nhi tăng cân nhanh mà mẹ không béo?',
    'Uống canxi và sắt vào thời điểm nào trong ngày để không bị táo bón?'
  ];

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Filter out the local welcome/system messages — only send real user/AI exchanges.
      // Gemini API requires the first content to have role='user'; the welcome bubble is a
      // client-side UI message with sender='ai' that must NOT be forwarded to the API.
      const apiMessages = [...messages, userMsg].filter(m => !m.isWelcome && !m.isError);
      const result = await chatWithPregnancyAI(apiMessages);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: typeof result === 'string' ? result : result.text,
        modelLabel: result.routingInfo?.modelLabel || 'Gemini AI',
        badgeClass: result.routingInfo?.badgeClass || 'bg-purple-50 text-purple-700 border-purple-200',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      let errorText = 'Đã có lỗi xảy ra khi kết nối tới trợ lý AI. Vui lòng thử lại sau giây lát.';
      if (err.message === 'MISSING_API_KEY') {
        errorText = 'Hệ thống AI đang tạm thời được bảo trì. Vui lòng quay lại sau ít phút.';
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          isError: true,
          text: errorText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Full-width Chat Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-b border-rose-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-200">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg">
                Bác Sĩ Dinh Dưỡng Thai Kỳ AI
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Trực tuyến 24/7</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Định tuyến thông minh: <span className="font-semibold text-sky-700">Nhóm 2 (Flash Lite)</span> cho câu hỏi nhanh, giao tiếp • <span className="font-semibold text-purple-700">Nhóm 3 (Flash)</span> cho chuyên sâu Y khoa
            </p>
          </div>
        </div>

        {/* Clear chat button */}
        {messages.length > 1 && (
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-white border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Xóa cuộc trò chuyện để bắt đầu lại"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hội thoại mới</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area - Expanded Full Width & Full Height */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-5 bg-stone-50/40">
        <div className="max-w-5xl mx-auto space-y-5 w-full">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white'
                      : 'bg-white border border-rose-200 text-rose-500 text-lg'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <span>🤰</span>}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-rose-500 text-white rounded-tr-xs'
                      : msg.isError
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-xs'
                      : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
                  }`}
                >
                  {/* Model routing tag for AI response */}
                  {!isUser && msg.modelLabel && (
                    <div className="mb-2.5 pb-2 border-b border-stone-100 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${msg.badgeClass || 'bg-stone-100 text-stone-600'}`}>
                        <Cpu className="w-3 h-3" />
                        <span>{msg.modelLabel}</span>
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-normal leading-relaxed">{msg.text}</div>

                  {/* Message timestamp and copy button */}
                  <div
                    className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                      isUser
                        ? 'border-white/20 text-white/70'
                        : 'border-stone-100 text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && !msg.isError && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-stone-50"
                        title="Sao chép câu trả lời"
                      >
                        {isCopiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-rose-200 text-rose-500 flex items-center justify-center text-lg shrink-0 shadow-xs">
                <span>🤰</span>
              </div>
              <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-stone-500 ml-2 font-medium">Bác sĩ AI đang phân tích và chuẩn bị câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-stone-400 shrink-0">Gợi ý hỏi nhanh:</span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-xs bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200 rounded-full px-3.5 py-1.5 whitespace-nowrap transition-colors shrink-0 font-medium shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar - Full Width at Bottom */}
      <div className="p-4 sm:p-5 bg-white border-t border-stone-200 shrink-0">
        <div className="max-w-5xl mx-auto w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi về món ăn, tuần thai, triệu chứng mẹ đang gặp phải..."
              disabled={isLoading}
              className="flex-1 px-5 py-3.5 bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white focus:outline-hidden rounded-2xl text-stone-800 text-sm shadow-2xs transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-md shadow-rose-200 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Gửi câu hỏi</span>
            </button>
          </form>
          <div className="text-[11px] text-stone-400 text-center mt-2">
            Mẹo: Các câu chào hỏi ngắn sẽ được phản hồi siêu tốc; câu hỏi chuyên sâu sẽ tự động kích hoạt mô hình Y khoa chuyên sâu.
          </div>
        </div>
      </div>
    </div>
  );
}
