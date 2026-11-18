// Health Profile Storage Utility
// Manages mom's health profile, prenatal checkups and ultrasound records in localStorage

const PROFILE_KEY = 'nganbi_mom_health_profile';
const CHECKUPS_KEY = 'nganbi_prenatal_checkups';
const DAILY_ADVICE_KEY = 'nganbi_daily_advice_cache';

// ─── DEFAULT EMPTY PROFILE ────────────────────────────────────────────────────
export const DEFAULT_HEALTH_PROFILE = {
  // Basic info
  momName: '',
  dueDate: '',            // ISO date string – YYYY-MM-DD
  lmpDate: '',            // Last menstrual period date (for week calc fallback)
  currentWeeks: '',       // Manual override if unsure of LMP
  motherAge: '',

  // Pregnancy conditions (checkboxes / selects)
  conditions: {
    morning_sickness: false,       // Ốm nghén
    severe_morning_sickness: false,// Ốm nghén nặng (Hyperemesis Gravidarum)
    gestational_diabetes: false,   // Tiểu đường thai kỳ
    hypertension: false,           // Tăng huyết áp thai kỳ
    preeclampsia: false,           // Tiền sản giật
    anemia: false,                 // Thiếu máu thiếu sắt
    constipation: false,           // Táo bón / Trĩ
    thyroid: false,                // Bệnh tuyến giáp
    placenta_previa: false,        // Nhau tiền đạo
    threatened_miscarriage: false, // Dọa sảy
    preterm_labor: false,          // Dọa sinh non
    twins: false,                  // Song thai
  },

  // Vitals (from latest checkup)
  latestWeight: '',       // kg
  latestHeight: '',       // cm (usually only once)
  latestBP: '',           // e.g. "120/80"
  latestHemoglobin: '',   // g/dL
  latestBloodSugar: '',   // mmol/L

  // Lifestyle
  diet: 'normal',         // 'normal' | 'vegetarian' | 'vegan' | 'halal'
  allergies: '',          // free text
  dislikes: '',           // free text

  // Extra notes from mom
  notes: '',

  // Metadata
  createdAt: null,
  updatedAt: null,
};

// ─── PROFILE CRUD ──────────────────────────────────────────────────────────────
export function getHealthProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_HEALTH_PROFILE };
    return { ...DEFAULT_HEALTH_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_HEALTH_PROFILE };
  }
}

export function saveHealthProfile(updates) {
  const current = getHealthProfile();
  const updated = {
    ...current,
    ...updates,
    conditions: { ...current.conditions, ...(updates.conditions || {}) },
    updatedAt: new Date().toISOString(),
    createdAt: current.createdAt || new Date().toISOString(),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHealthProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(DAILY_ADVICE_KEY);
}

// ─── PREGNANCY WEEK CALCULATION ────────────────────────────────────────────────
export function calcCurrentPregnancyWeek(profile) {
  // Priority: manual override → dueDate backtrack → lmpDate
  if (profile.currentWeeks && parseInt(profile.currentWeeks, 10) > 0) {
    return parseInt(profile.currentWeeks, 10);
  }
  if (profile.dueDate) {
    const due = new Date(profile.dueDate);
    const today = new Date();
    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
    // 280 days = 40 weeks full term
    const weeksPassed = Math.round((280 - diffDays) / 7);
    if (weeksPassed >= 1 && weeksPassed <= 42) return weeksPassed;
  }
  if (profile.lmpDate) {
    const lmp = new Date(profile.lmpDate);
    const today = new Date();
    const diffDays = Math.round((today - lmp) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    if (weeks >= 1 && weeks <= 42) return weeks;
  }
  return null;
}

export function getTrimesterFromWeek(week) {
  if (!week) return null;
  if (week <= 12) return 't1';
  if (week <= 27) return 't2';
  return 't3';
}

export function getTrimesterLabel(week) {
  if (!week) return 'Chưa xác định';
  if (week <= 12) return '3 Tháng Đầu (Tam cá nguyệt 1)';
  if (week <= 27) return '3 Tháng Giữa (Tam cá nguyệt 2)';
  return '3 Tháng Cuối (Tam cá nguyệt 3)';
}

// ─── PRENATAL CHECKUP RECORDS ──────────────────────────────────────────────────
export const CHECKUP_TYPES = {
  general: { label: 'Khám tổng quát', icon: '🩺' },
  ultrasound: { label: 'Siêu âm thai', icon: '📡' },
  blood_test: { label: 'Xét nghiệm máu', icon: '🩸' },
  glucose_test: { label: 'Test dung nạp đường', icon: '🍬' },
  urine_test: { label: 'Xét nghiệm nước tiểu', icon: '🧪' },
  nipt: { label: 'NIPT / Double Test / Triple Test', icon: '🧬' },
  cervix_check: { label: 'Đo độ dài cổ tử cung', icon: '📏' },
  gbs: { label: 'Xét nghiệm GBS', icon: '🦠' },
  other: { label: 'Khác', icon: '📋' },
};

export function getCheckupRecords() {
  try {
    const raw = localStorage.getItem(CHECKUPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCheckupRecord(record) {
  const list = getCheckupRecords();
  const newRecord = {
    id: record.id || `chk-${Date.now()}`,
    type: record.type || 'general',
    date: record.date || new Date().toISOString().split('T')[0],
    weekAtCheckup: record.weekAtCheckup || '',
    hospital: record.hospital || '',
    doctor: record.doctor || '',
    // Vitals measured at this checkup
    weight: record.weight || '',
    bp: record.bp || '',
    hemoglobin: record.hemoglobin || '',
    bloodSugar: record.bloodSugar || '',
    fetalHeartRate: record.fetalHeartRate || '',
    // Ultrasound-specific fields
    fetalWeight: record.fetalWeight || '',      // grams
    bpd: record.bpd || '',                     // Biparietal diameter mm
    fl: record.fl || '',                       // Femur length mm
    ac: record.ac || '',                       // Abdominal circumference mm
    hc: record.hc || '',                       // Head circumference mm
    amnioticFluid: record.amnioticFluid || '', // AFI cm
    placentaPosition: record.placentaPosition || '',
    // Result & notes
    result: record.result || '',               // Doctor's conclusion text
    notes: record.notes || '',
    alerts: record.alerts || [],               // Array of alert strings
    // Metadata
    addedAt: record.addedAt || new Date().toISOString(),
  };

  // If updating existing record
  const idx = list.findIndex(r => r.id === newRecord.id);
  let updated;
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = newRecord;
  } else {
    updated = [newRecord, ...list];
  }

  // Sort by date descending
  updated.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem(CHECKUPS_KEY, JSON.stringify(updated));
  return newRecord;
}

export function deleteCheckupRecord(id) {
  const list = getCheckupRecords().filter(r => r.id !== id);
  localStorage.setItem(CHECKUPS_KEY, JSON.stringify(list));
}

// ─── DAILY ADVICE CACHE ────────────────────────────────────────────────────────
export function getDailyAdviceCache() {
  try {
    const raw = localStorage.getItem(DAILY_ADVICE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    if (cache.date !== today) return null; // Expired
    return cache;
  } catch {
    return null;
  }
}

export function saveDailyAdviceCache(data) {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(DAILY_ADVICE_KEY, JSON.stringify({ ...data, date: today }));
}

// ─── ACTIVE CONDITIONS SUMMARY ─────────────────────────────────────────────────
export const CONDITION_LABELS = {
  morning_sickness: 'Ốm nghén',
  severe_morning_sickness: 'Ốm nghén nặng',
  gestational_diabetes: 'Tiểu đường thai kỳ',
  hypertension: 'Tăng huyết áp',
  preeclampsia: 'Tiền sản giật',
  anemia: 'Thiếu máu thiếu sắt',
  constipation: 'Táo bón / Trĩ',
  thyroid: 'Bệnh tuyến giáp',
  placenta_previa: 'Nhau tiền đạo',
  threatened_miscarriage: 'Dọa sảy',
  preterm_labor: 'Dọa sinh non',
  twins: 'Song thai',
};

export function getActiveConditions(profile) {
  if (!profile?.conditions) return [];
  return Object.entries(profile.conditions)
    .filter(([, v]) => v)
    .map(([k]) => ({ key: k, label: CONDITION_LABELS[k] || k }));
}
