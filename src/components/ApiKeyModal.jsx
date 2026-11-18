import React, { useState, useEffect } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, ExternalLink, Eye, EyeOff, Sparkles, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { getStoredApiKey, saveApiKey, testGeminiApiKey } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredApiKey();
      setApiKeyInput(existing || '');
      setTestStatus(null);
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setTestStatus('error');
      setStatusMessage('Vui lòng nhập API Key.');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Đang kiểm tra kết nối với Google AI Studio...');

    const res = await testGeminiApiKey(trimmed);
    if (res.ok) {
      saveApiKey(trimmed);
      setTestStatus('success');
      setStatusMessage(res.message);
      if (onKeySaved) onKeySaved(trimmed);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setTestStatus('error');
      setStatusMessage(res.error);
    }
  };

  const handleClearKey = () => {
    saveApiKey('');
    setApiKeyInput('');
    setTestStatus(null);
    setStatusMessage('Đã xóa API Key thành công.');
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-b border-rose-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-rose-200 text-rose-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-stone-900">Cài Đặt Google AI Studio API Key</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Free Tier
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Kích hoạt Bác sĩ Dinh Dưỡng AI và tra cứu thông minh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Instructions Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-stone-800 text-sm">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Cách lấy API Key miễn phí (30 giây)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 underline font-semibold"
              >
                <span>Mở Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <ol className="list-decimal pl-4 space-y-1 leading-relaxed text-stone-600">
              <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-rose-600 font-semibold underline">aistudio.google.com/app/apikey</a> và đăng nhập tài khoản Google.</li>
              <li>Bấm nút <strong>"Create API key"</strong> (Tạo khóa API mới).</li>
              <li>Sao chép (Copy) đoạn mã khóa vừa tạo (dạng <code className="bg-stone-200/80 px-1 py-0.5 rounded text-[11px] text-stone-800 font-mono">AIzaSy...</code>).</li>
              <li>Dán vào ô bên dưới và bấm nút <strong>"Kiểm tra & Lưu Key"</strong>.</li>
            </ol>

            <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gói Miễn phí hoàn toàn 100%, không yêu cầu thẻ visa/mastercard.</span>
            </div>
          </div>

          {/* Key Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Nhập API Key của bạn:
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestStatus(null);
                  setStatusMessage('');
                }}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-12 py-3 bg-stone-50 border-2 border-stone-200 focus:border-rose-500 focus:bg-white focus:outline-hidden rounded-2xl text-stone-900 text-sm font-mono shadow-2xs transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                title={showKey ? 'Ẩn key' : 'Hiện key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Message Alert */}
          {testStatus && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 transition-all ${
                testStatus === 'testing'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testStatus === 'testing' && <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0 mt-0.5" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-[11px] text-stone-400 leading-relaxed">
            🔒 <strong>Bảo mật riêng tư:</strong> Khóa API của bạn được lưu an toàn trực tiếp trên trình duyệt máy bạn (localStorage) và chỉ gửi trực tiếp lên Google AI Studio để thực hiện truy vấn. Không có máy chủ trung gian nào lưu giữ key của bạn.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
          {apiKeyInput ? (
            <button
              onClick={handleClearKey}
              className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Key</span>
            </button>
          ) : (
            <span className="text-xs text-stone-400">Chưa cài đặt</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Để sau
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={testStatus === 'testing' || !apiKeyInput.trim()}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              {testStatus === 'testing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kiểm tra & Lưu Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

