import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Heart, Save, Plus, Trash2, ChevronDown, ChevronUp,
  ClipboardList, Activity, AlertCircle, Check, Edit3, X, FileText,
  Stethoscope, Droplets, Scale, Thermometer, Baby
} from 'lucide-react';
import {
  getHealthProfile, saveHealthProfile, DEFAULT_HEALTH_PROFILE,
  getCheckupRecords, saveCheckupRecord, deleteCheckupRecord,
  calcCurrentPregnancyWeek, getTrimesterLabel, getActiveConditions,
  CONDITION_LABELS, CHECKUP_TYPES,
} from '../utils/healthProfileStorage';

// ─── CONDITION CHECKBOX LIST ───────────────────────────────────────────────────
const CONDITION_GROUPS = [
  {
    label: 'Triệu chứng thường gặp',
    icon: '🤢',
    keys: ['morning_sickness', 'severe_morning_sickness', 'constipation'],
  },
  {
    label: 'Bệnh lý chuyển hoá',
    icon: '💉',
    keys: ['gestational_diabetes', 'anemia', 'thyroid'],
  },
  {
    label: 'Bệnh lý tim mạch',
    icon: '❤️',
    keys: ['hypertension', 'preeclampsia'],
  },
  {
    label: 'Rủi ro thai kỳ',
    icon: '⚠️',
    keys: ['threatened_miscarriage', 'preterm_labor', 'placenta_previa', 'twins'],
  },
];

// ─── CHECKUP FORM ──────────────────────────────────────────────────────────────
function CheckupForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    type: 'general',
    date: new Date().toISOString().split('T')[0],
    weekAtCheckup: '',
    hospital: '',
    doctor: '',
    weight: '',
    bp: '',
    hemoglobin: '',
    bloodSugar: '',
    fetalHeartRate: '',
    fetalWeight: '',
    bpd: '', fl: '', ac: '', hc: '',
    amnioticFluid: '',
    placentaPosition: '',
    result: '',
    notes: '',
    alerts: [],
    ...initial,
  });
  const [alertInput, setAlertInput] = useState('');

  const isUltrasound = form.type === 'ultrasound';

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addAlert = () => {
    if (!alertInput.trim()) return;
    set('alerts', [...(form.alerts || []), alertInput.trim()]);
    setAlertInput('');
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-500" />
          {initial?.id ? 'Chỉnh sửa phiếu khám' : 'Thêm phiếu khám mới'}
        </h4>
        <button onClick={onCancel} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"><X className="w-4 h-4" /></button>
      </div>

      {/* Basic */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label-xs">Loại phiếu khám</label>
          <select value={form.type} onChange={e => set('type', e.target.value)} className="input-field">
            {Object.entries(CHECKUP_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-xs">Ngày khám</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-xs">Tuần thai lúc khám</label>
          <input type="number" value={form.weekAtCheckup} onChange={e => set('weekAtCheckup', e.target.value)} placeholder="VD: 20" className="input-field" min="1" max="42" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label-xs">Bệnh viện / Phòng khám</label>
          <input value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Tên bệnh viện" className="input-field" />
        </div>
        <div>
          <label className="label-xs">Bác sĩ phụ trách</label>
          <input value={form.doctor} onChange={e => set('doctor', e.target.value)} placeholder="Tên bác sĩ" className="input-field" />
        </div>
      </div>

      {/* Vitals */}
      <div>
        <p className="label-xs mb-2 flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-rose-500" /> Chỉ số sinh hiệu</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="label-xs-sub">Cân nặng (kg)</label>
            <input type="number" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="VD: 58.5" className="input-field" />
          </div>
          <div>
            <label className="label-xs-sub">Huyết áp</label>
            <input value={form.bp} onChange={e => set('bp', e.target.value)} placeholder="VD: 120/80" className="input-field" />
          </div>
          <div>
            <label className="label-xs-sub">Hemoglobin (g/dL)</label>
            <input type="number" step="0.1" value={form.hemoglobin} onChange={e => set('hemoglobin', e.target.value)} placeholder="VD: 11.5" className="input-field" />
          </div>
          <div>
            <label className="label-xs-sub">Đường huyết (mmol/L)</label>
            <input type="number" step="0.1" value={form.bloodSugar} onChange={e => set('bloodSugar', e.target.value)} placeholder="VD: 5.1" className="input-field" />
          </div>
        </div>
      </div>

      {/* Fetal vitals */}
      <div>
        <p className="label-xs mb-2 flex items-center gap-1"><Baby className="w-3.5 h-3.5 text-pink-500" /> Thông tin thai nhi</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="label-xs-sub">Tim thai (lần/phút)</label>
            <input type="number" value={form.fetalHeartRate} onChange={e => set('fetalHeartRate', e.target.value)} placeholder="VD: 148" className="input-field" />
          </div>
          <div>
            <label className="label-xs-sub">Cân nặng thai (gram)</label>
            <input type="number" value={form.fetalWeight} onChange={e => set('fetalWeight', e.target.value)} placeholder="VD: 1200" className="input-field" />
          </div>
        </div>
      </div>

      {/* Ultrasound specific */}
      {isUltrasound && (
        <div>
          <p className="label-xs mb-2 flex items-center gap-1">📡 Thông số siêu âm</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="label-xs-sub">BPD (mm)</label>
              <input type="number" step="0.1" value={form.bpd} onChange={e => set('bpd', e.target.value)} placeholder="Đường kính đầu" className="input-field" />
            </div>
            <div>
              <label className="label-xs-sub">HC (mm)</label>
              <input type="number" step="0.1" value={form.hc} onChange={e => set('hc', e.target.value)} placeholder="Chu vi đầu" className="input-field" />
            </div>
            <div>
              <label className="label-xs-sub">AC (mm)</label>
              <input type="number" step="0.1" value={form.ac} onChange={e => set('ac', e.target.value)} placeholder="Chu vi bụng" className="input-field" />
            </div>
            <div>
              <label className="label-xs-sub">FL (mm)</label>
              <input type="number" step="0.1" value={form.fl} onChange={e => set('fl', e.target.value)} placeholder="Chiều dài xương đùi" className="input-field" />
            </div>
            <div>
              <label className="label-xs-sub">Nước ối AFI (cm)</label>
              <input type="number" step="0.1" value={form.amnioticFluid} onChange={e => set('amnioticFluid', e.target.value)} placeholder="VD: 14.2" className="input-field" />
            </div>
            <div className="sm:col-span-3">
              <label className="label-xs-sub">Vị trí bánh nhau</label>
              <input value={form.placentaPosition} onChange={e => set('placentaPosition', e.target.value)} placeholder="VD: Bám mặt sau, không tiền đạo" className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* Result & Notes */}
      <div>
        <label className="label-xs">Kết luận / Chẩn đoán của bác sĩ</label>
        <textarea value={form.result} onChange={e => set('result', e.target.value)} placeholder="Nhập kết luận hoặc chẩn đoán..." rows={2} className="input-field resize-none" />
      </div>
      <div>
        <label className="label-xs">Ghi chú thêm</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Thuốc được kê, lịch tái khám, chế độ ăn bác sĩ dặn..." rows={2} className="input-field resize-none" />
      </div>

      {/* Alerts */}
      <div>
        <label className="label-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Dấu hiệu cần theo dõi / Cảnh báo</label>
        <div className="flex gap-2 mt-1.5">
          <input value={alertInput} onChange={e => setAlertInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAlert()} placeholder="VD: Huyết áp cao, cần theo dõi..." className="input-field flex-1" />
          <button onClick={addAlert} className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors">Thêm</button>
        </div>
        {form.alerts && form.alerts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.alerts.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                {a}
                <button onClick={() => set('alerts', form.alerts.filter((_, idx) => idx !== i))} className="text-amber-400 hover:text-amber-700 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition-colors">Huỷ</button>
        <button
          onClick={() => onSave(form)}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-bold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Lưu phiếu khám
        </button>
      </div>
    </div>
  );
}

// ─── CHECKUP RECORD CARD ───────────────────────────────────────────────────────
function CheckupCard({ record, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = CHECKUP_TYPES[record.type] || CHECKUP_TYPES.other;

  const hasVitals = record.weight || record.bp || record.hemoglobin || record.bloodSugar;
  const hasFetalData = record.fetalHeartRate || record.fetalWeight || record.bpd || record.fl;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">
            {typeInfo.icon}
          </div>
          <div>
            <div className="font-semibold text-stone-900 text-sm">{typeInfo.label}</div>
            <div className="text-xs text-stone-500">
              {new Date(record.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              {record.weekAtCheckup && <span className="ml-2 text-rose-600 font-semibold">• Tuần {record.weekAtCheckup}</span>}
              {record.hospital && <span className="ml-2">• {record.hospital}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {record.alerts && record.alerts.length > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              {record.alerts.length} cảnh báo
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100">
          {/* Vitals */}
          {hasVitals && (
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-3 mb-2">Sinh hiệu</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {record.weight && <VitalBadge icon="⚖️" label="Cân nặng" value={`${record.weight} kg`} />}
                {record.bp && <VitalBadge icon="💓" label="Huyết áp" value={record.bp} />}
                {record.hemoglobin && <VitalBadge icon="🩸" label="Hemoglobin" value={`${record.hemoglobin} g/dL`} />}
                {record.bloodSugar && <VitalBadge icon="🍬" label="Đường huyết" value={`${record.bloodSugar} mmol/L`} />}
              </div>
            </div>
          )}

          {/* Fetal */}
          {hasFetalData && (
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Thai nhi</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {record.fetalHeartRate && <VitalBadge icon="💗" label="Tim thai" value={`${record.fetalHeartRate} lpm`} />}
                {record.fetalWeight && <VitalBadge icon="👶" label="Cân nặng thai" value={`${record.fetalWeight} g`} />}
                {record.bpd && <VitalBadge icon="📏" label="BPD" value={`${record.bpd} mm`} />}
                {record.fl && <VitalBadge icon="📏" label="FL" value={`${record.fl} mm`} />}
                {record.hc && <VitalBadge icon="📏" label="HC" value={`${record.hc} mm`} />}
                {record.ac && <VitalBadge icon="📏" label="AC" value={`${record.ac} mm`} />}
                {record.amnioticFluid && <VitalBadge icon="💧" label="Nước ối" value={`${record.amnioticFluid} cm`} />}
                {record.placentaPosition && <VitalBadge icon="🫀" label="Bánh nhau" value={record.placentaPosition} />}
              </div>
            </div>
          )}

          {/* Result */}
          {record.result && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-1">📋 Kết luận bác sĩ</p>
              <p className="text-xs text-stone-700 leading-relaxed">{record.result}</p>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div className="text-xs text-stone-600 bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="font-semibold text-stone-700">Ghi chú: </span>
              {record.notes}
            </div>
          )}

          {/* Alerts */}
          {record.alerts && record.alerts.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 mb-1.5">⚠️ Dấu hiệu cần theo dõi</p>
              <ul className="space-y-1">
                {record.alerts.map((a, i) => (
                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => onEdit(record)} className="px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:bg-blue-50 border border-blue-200 font-semibold flex items-center gap-1 transition-colors">
              <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
            </button>
            <button onClick={() => onDelete(record.id)} className="px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold flex items-center gap-1 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Xoá
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VitalBadge({ icon, label, value }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-2 text-center">
      <div className="text-base">{icon}</div>
      <div className="text-[10px] text-stone-400 mt-0.5">{label}</div>
      <div className="text-xs font-bold text-stone-800 mt-0.5 truncate">{value}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MomHealthProfile() {
  const [profile, setProfile] = useState(getHealthProfile);
  const [checkups, setCheckups] = useState(getCheckupRecords);
  const [saved, setSaved] = useState(false);
  const [showCheckupForm, setShowCheckupForm] = useState(false);
  const [editingCheckup, setEditingCheckup] = useState(null);
  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'checkups'

  const week = calcCurrentPregnancyWeek(profile);
  const trimLabel = week ? getTrimesterLabel(week) : null;
  const activeConditions = getActiveConditions(profile);

  const handleSaveProfile = () => {
    saveHealthProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleConditionToggle = (key) => {
    setProfile(p => ({
      ...p,
      conditions: { ...p.conditions, [key]: !p.conditions[key] }
    }));
  };

  const handleSaveCheckup = (record) => {
    saveCheckupRecord(record);
    setCheckups(getCheckupRecords());
    // Auto-update latest vitals in profile
    const updates = {};
    if (record.weight) updates.latestWeight = record.weight;
    if (record.bp) updates.latestBP = record.bp;
    if (record.hemoglobin) updates.latestHemoglobin = record.hemoglobin;
    if (record.bloodSugar) updates.latestBloodSugar = record.bloodSugar;
    if (Object.keys(updates).length > 0) {
      const updated = saveHealthProfile({ ...profile, ...updates });
      setProfile(updated);
    }
    setShowCheckupForm(false);
    setEditingCheckup(null);
  };

  const handleDeleteCheckup = (id) => {
    if (window.confirm('Mẹ có chắc muốn xoá phiếu khám này không?')) {
      deleteCheckupRecord(id);
      setCheckups(getCheckupRecords());
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-6 sm:p-8 border border-rose-100 shadow-sm overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5" />
            Hồ sơ sức khoẻ thai kỳ cá nhân hoá
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {profile.momName ? `Hồ sơ của ${profile.momName} 💕` : 'Hồ Sơ Sức Khoẻ Của Mẹ 💕'}
          </h2>
          <p className="text-stone-600 text-sm mt-1.5 leading-relaxed max-w-2xl">
            Cập nhật thông tin thai kỳ, tình trạng sức khoẻ và phiếu khám thai để nhận <strong>lời khuyên dinh dưỡng hàng ngày</strong> được cá nhân hoá riêng cho mẹ.
          </p>
          {week && (
            <div className="mt-4 inline-flex items-center gap-3 bg-white/80 border border-rose-200 rounded-2xl px-4 py-2.5">
              <span className="text-2xl font-black text-rose-600">Tuần {week}</span>
              <div>
                <div className="text-xs font-bold text-stone-800">{trimLabel}</div>
                {activeConditions.length > 0 && (
                  <div className="text-xs text-amber-600 mt-0.5">
                    Đang theo dõi: {activeConditions.slice(0, 2).map(c => c.label).join(' • ')}
                    {activeConditions.length > 2 && ` +${activeConditions.length - 2}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none pointer-events-none">🤰</div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'profile', label: 'Hồ sơ sức khoẻ', icon: User },
          { id: 'checkups', label: `Phiếu khám (${checkups.length})`, icon: ClipboardList },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeSection === id
                ? 'bg-white text-rose-700 shadow-sm border border-rose-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── PROFILE SECTION ── */}
      {activeSection === 'profile' && (
        <div className="space-y-5">
          {/* Basic info */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-rose-500" /> Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label-xs">Tên mẹ bầu</label>
                <input value={profile.momName} onChange={e => setProfile(p => ({ ...p, momName: e.target.value }))} placeholder="Nhập tên của mẹ" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Tuổi mẹ</label>
                <input type="number" value={profile.motherAge} onChange={e => setProfile(p => ({ ...p, motherAge: e.target.value }))} placeholder="VD: 28" className="input-field" min="15" max="55" />
              </div>
              <div>
                <label className="label-xs">Chế độ ăn</label>
                <select value={profile.diet} onChange={e => setProfile(p => ({ ...p, diet: e.target.value }))} className="input-field">
                  <option value="normal">Ăn bình thường</option>
                  <option value="vegetarian">Ăn chay trường</option>
                  <option value="vegan">Thuần chay (Vegan)</option>
                  <option value="halal">Halal</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Dị ứng thực phẩm</label>
                <input value={profile.allergies} onChange={e => setProfile(p => ({ ...p, allergies: e.target.value }))} placeholder="VD: Hải sản, lạc, sữa..." className="input-field" />
              </div>
              <div>
                <label className="label-xs">Món không thích / kiêng ăn</label>
                <input value={profile.dislikes} onChange={e => setProfile(p => ({ ...p, dislikes: e.target.value }))} placeholder="VD: Rau mùi, mắm tôm..." className="input-field" />
              </div>
            </div>
          </div>

          {/* Pregnancy dates */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-rose-500" /> Thông tin thai kỳ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-xs">Ngày dự sinh (DUE DATE)</label>
                <input type="date" value={profile.dueDate} onChange={e => setProfile(p => ({ ...p, dueDate: e.target.value }))} className="input-field" />
                <p className="text-[11px] text-stone-400 mt-1">Ưu tiên tính tuần thai từ đây</p>
              </div>
              <div>
                <label className="label-xs">Ngày kinh cuối (LMP)</label>
                <input type="date" value={profile.lmpDate} onChange={e => setProfile(p => ({ ...p, lmpDate: e.target.value }))} className="input-field" />
                <p className="text-[11px] text-stone-400 mt-1">Phương án thay thế nếu chưa rõ DUE DATE</p>
              </div>
              <div>
                <label className="label-xs">Tuần thai hiện tại (nhập tay)</label>
                <input type="number" value={profile.currentWeeks} onChange={e => setProfile(p => ({ ...p, currentWeeks: e.target.value }))} placeholder="VD: 20" className="input-field" min="1" max="42" />
                <p className="text-[11px] text-stone-400 mt-1">Ghi đè nếu bác sĩ xác nhận khác</p>
              </div>
            </div>
          </div>

          {/* Latest vitals */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-rose-500" /> Chỉ số sinh hiệu gần nhất
            </h3>
            <p className="text-xs text-stone-500">Sẽ được tự động cập nhật khi mẹ nhập phiếu khám mới</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="label-xs">Cân nặng (kg)</label>
                <input type="number" step="0.1" value={profile.latestWeight} onChange={e => setProfile(p => ({ ...p, latestWeight: e.target.value }))} placeholder="VD: 58.5" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Huyết áp</label>
                <input value={profile.latestBP} onChange={e => setProfile(p => ({ ...p, latestBP: e.target.value }))} placeholder="VD: 120/80" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Hemoglobin (g/dL)</label>
                <input type="number" step="0.1" value={profile.latestHemoglobin} onChange={e => setProfile(p => ({ ...p, latestHemoglobin: e.target.value }))} placeholder="VD: 11.5" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Đường huyết (mmol/L)</label>
                <input type="number" step="0.1" value={profile.latestBloodSugar} onChange={e => setProfile(p => ({ ...p, latestBloodSugar: e.target.value }))} placeholder="VD: 5.1" className="input-field" />
              </div>
            </div>
          </div>

          {/* Health conditions */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <Stethoscope className="w-5 h-5 text-rose-500" /> Tình trạng sức khoẻ hiện tại
            </h3>
            <p className="text-xs text-stone-500">Chọn tất cả tình trạng mà mẹ đang được theo dõi / điều trị. Thông tin này giúp AI đưa ra lời khuyên phù hợp hơn.</p>
            <div className="space-y-4">
              {CONDITION_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{group.icon} {group.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {group.keys.map(key => (
                      <label
                        key={key}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                          profile.conditions[key]
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-rose-200 hover:bg-rose-50/40'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          profile.conditions[key] ? 'bg-rose-500 border-rose-500' : 'border-stone-300 bg-white'
                        }`}>
                          {profile.conditions[key] && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!profile.conditions[key]}
                          onChange={() => handleConditionToggle(key)}
                        />
                        <span className="text-xs font-medium">{CONDITION_LABELS[key]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-rose-500" /> Ghi chú thêm từ mẹ
            </h3>
            <textarea
              value={profile.notes}
              onChange={e => setProfile(p => ({ ...p, notes: e.target.value }))}
              placeholder="Bác sĩ dặn gì, mẹ cảm thấy thế nào, những điều cần nhớ..."
              rows={3}
              className="input-field resize-none w-full"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              className={`px-8 py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
                saved
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200 hover:from-rose-600 hover:to-pink-600'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Đã lưu thành công! ✓' : 'Lưu hồ sơ sức khoẻ'}
            </button>
          </div>
        </div>
      )}

      {/* ── CHECKUPS SECTION ── */}
      {activeSection === 'checkups' && (
        <div className="space-y-4">
          {/* Add new button */}
          {!showCheckupForm && !editingCheckup && (
            <button
              onClick={() => setShowCheckupForm(true)}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Thêm phiếu khám / siêu âm mới
            </button>
          )}

          {/* Add form */}
          {showCheckupForm && (
            <CheckupForm
              initial={null}
              onSave={handleSaveCheckup}
              onCancel={() => setShowCheckupForm(false)}
            />
          )}

          {/* Edit form */}
          {editingCheckup && (
            <CheckupForm
              initial={editingCheckup}
              onSave={handleSaveCheckup}
              onCancel={() => setEditingCheckup(null)}
            />
          )}

          {/* Records list */}
          {checkups.length === 0 && !showCheckupForm ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-blue-200">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="font-bold text-stone-700 text-base mb-1">Chưa có phiếu khám nào</h3>
              <p className="text-xs text-stone-500">Thêm phiếu khám thai, siêu âm để theo dõi hành trình thai kỳ của mẹ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkups.map(record => (
                <CheckupCard
                  key={record.id}
                  record={record}
                  onEdit={r => { setEditingCheckup(r); setShowCheckupForm(false); }}
                  onDelete={handleDeleteCheckup}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
