const EVENT_STORAGE_KEY = "superHelloEventsV01";
const PARTICIPATION_STORAGE_KEY = "superHelloParticipationsV02";
const PAYMENT_STORAGE_KEY = "superHelloPaymentsV03";
const MCY_EXPORT_LOG_STORAGE_KEY = "superHelloMcyExportLogsV04";
const GOODS_STORAGE_KEY = "superHelloGoodsV07";
const TRAVEL_STORAGE_KEY = "superHelloTravelsV08";
const REVIEW_STORAGE_KEY = "superHelloReviewsV09";
const APP_VERSION = "1.0";
const APP_NAME = "SUPER HELLO";
const STORAGE_DEFINITIONS = [
  { key: EVENT_STORAGE_KEY, label: "イベント候補", getData: () => events },
  { key: PARTICIPATION_STORAGE_KEY, label: "参加予定", getData: () => participations },
  { key: PAYMENT_STORAGE_KEY, label: "チケット支払い", getData: () => payments },
  { key: MCY_EXPORT_LOG_STORAGE_KEY, label: "MCY連携ログ", getData: () => mcyExportLogs },
  { key: GOODS_STORAGE_KEY, label: "グッズ", getData: () => goods },
  { key: TRAVEL_STORAGE_KEY, label: "遠征", getData: () => travels },
  { key: REVIEW_STORAGE_KEY, label: "参加履歴", getData: () => reviews }
];

let events = [];
let participations = [];
let payments = [];
let mcyExportLogs = [];
let goods = [];
let travels = [];
let reviews = [];

let editingId = null;
let editingParticipationId = null;
let editingPaymentId = null;
let editingGoodsId = null;
let editingTravelId = null;
let editingReviewId = null;
let importPreviewData = null;

const eventForm = document.getElementById("eventForm");
const eventTableBody = document.getElementById("eventTableBody");
const eventCount = document.getElementById("eventCount");
const resetButton = document.getElementById("resetButton");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const exportJsonButton = document.getElementById("exportJsonButton");
const clearAllButton = document.getElementById("clearAllButton");
const importSourceText = document.getElementById("importSourceText");
const analyzeImportButton = document.getElementById("analyzeImportButton");
const clearImportButton = document.getElementById("clearImportButton");
const applyImportButton = document.getElementById("applyImportButton");
const importPreviewTableBody = document.getElementById("importPreviewTableBody");

const participationForm = document.getElementById("participationForm");
const participationTableBody = document.getElementById("participationTableBody");
const participationCount = document.getElementById("participationCount");
const participationSearchInput = document.getElementById("participationSearchInput");
const participationStatusFilter = document.getElementById("participationStatusFilter");
const exportParticipationJsonButton = document.getElementById("exportParticipationJsonButton");
const clearParticipationButton = document.getElementById("clearParticipationButton");
const resetParticipationButton = document.getElementById("resetParticipationButton");

const reviewForm = document.getElementById("reviewForm");
const reviewTableBody = document.getElementById("reviewTableBody");
const reviewCount = document.getElementById("reviewCount");
const reviewAverageSatisfaction = document.getElementById("reviewAverageSatisfaction");
const reviewMaxSatisfaction = document.getElementById("reviewMaxSatisfaction");
const reviewLatestDate = document.getElementById("reviewLatestDate");
const reviewSearchInput = document.getElementById("reviewSearchInput");
const reviewGroupFilter = document.getElementById("reviewGroupFilter");
const reviewSatisfactionFilter = document.getElementById("reviewSatisfactionFilter");
const reviewTagSearchInput = document.getElementById("reviewTagSearchInput");
const newReviewButton = document.getElementById("newReviewButton");
const exportReviewJsonButton = document.getElementById("exportReviewJsonButton");
const clearReviewButton = document.getElementById("clearReviewButton");
const resetReviewButton = document.getElementById("resetReviewButton");

const paymentForm = document.getElementById("paymentForm");
const paymentTableBody = document.getElementById("paymentTableBody");
const paymentCount = document.getElementById("paymentCount");
const paymentTotal = document.getElementById("paymentTotal");
const paymentSearchInput = document.getElementById("paymentSearchInput");
const paymentStatusFilter = document.getElementById("paymentStatusFilter");
const exportPaymentJsonButton = document.getElementById("exportPaymentJsonButton");
const clearPaymentButton = document.getElementById("clearPaymentButton");
const resetPaymentButton = document.getElementById("resetPaymentButton");
const goodsForm = document.getElementById("goodsForm");
const goodsTableBody = document.getElementById("goodsTableBody");
const goodsCount = document.getElementById("goodsCount");
const goodsTotal = document.getElementById("goodsTotal");
const goodsSearchInput = document.getElementById("goodsSearchInput");
const goodsGroupFilter = document.getElementById("goodsGroupFilter");
const goodsMcyStatusFilter = document.getElementById("goodsMcyStatusFilter");
const newGoodsButton = document.getElementById("newGoodsButton");
const exportGoodsJsonButton = document.getElementById("exportGoodsJsonButton");
const clearGoodsButton = document.getElementById("clearGoodsButton");
const resetGoodsButton = document.getElementById("resetGoodsButton");
const travelForm = document.getElementById("travelForm");
const travelTableBody = document.getElementById("travelTableBody");
const travelCount = document.getElementById("travelCount");
const travelTotal = document.getElementById("travelTotal");
const travelSearchInput = document.getElementById("travelSearchInput");
const travelBookingStatusFilter = document.getElementById("travelBookingStatusFilter");
const travelMcyStatusFilter = document.getElementById("travelMcyStatusFilter");
const newTravelButton = document.getElementById("newTravelButton");
const exportTravelJsonButton = document.getElementById("exportTravelJsonButton");
const clearTravelButton = document.getElementById("clearTravelButton");
const resetTravelButton = document.getElementById("resetTravelButton");
const mcyExportTarget = document.getElementById("mcyExportTarget");
const exportMcyCsvButton = document.getElementById("exportMcyCsvButton");
const exportMcyJsonButton = document.getElementById("exportMcyJsonButton");
const markMcyExportedButton = document.getElementById("markMcyExportedButton");
const mcyPreviewTableBody = document.getElementById("mcyPreviewTableBody");
const mcyPreviewCount = document.getElementById("mcyPreviewCount");
const mcyPreviewTotal = document.getElementById("mcyPreviewTotal");
const reminderTargetFilter = document.getElementById("reminderTargetFilter");
const reminderTypeFilter = document.getElementById("reminderTypeFilter");
const reminderTableBody = document.getElementById("reminderTableBody");
const reminderCount = document.getElementById("reminderCount");
const exportBackupButton = document.getElementById("exportBackupButton");
const restoreBackupSelectButton = document.getElementById("restoreBackupSelectButton");
const restoreBackupFile = document.getElementById("restoreBackupFile");
const loadSampleDataButton = document.getElementById("loadSampleDataButton");
const clearAllDataButton = document.getElementById("clearAllDataButton");

function loadEvents() {
  events = loadStoredArray(EVENT_STORAGE_KEY);
}

function saveEvents() {
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
}

function loadParticipations() {
  participations = loadStoredArray(PARTICIPATION_STORAGE_KEY);
}

function saveParticipations() {
  localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(participations));
}

function loadPayments() {
  payments = loadStoredArray(PAYMENT_STORAGE_KEY);
}

function savePayments() {
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
}

function loadMcyExportLogs() {
  mcyExportLogs = loadStoredArray(MCY_EXPORT_LOG_STORAGE_KEY);
}

function saveMcyExportLogs() {
  localStorage.setItem(MCY_EXPORT_LOG_STORAGE_KEY, JSON.stringify(mcyExportLogs));
}

function loadGoods() {
  goods = loadStoredArray(GOODS_STORAGE_KEY);
}

function saveGoods() {
  localStorage.setItem(GOODS_STORAGE_KEY, JSON.stringify(goods));
}

function loadTravels() {
  travels = loadStoredArray(TRAVEL_STORAGE_KEY);
}

function saveTravels() {
  localStorage.setItem(TRAVEL_STORAGE_KEY, JSON.stringify(travels));
}

function loadReviews() {
  reviews = loadStoredArray(REVIEW_STORAGE_KEY);
}

function saveReviews() {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
}

function loadStoredArray(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function generateId(prefix) {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${ymd}${random}`;
}

function yen(value) {
  const number = toSafeNumber(value);
  return number.toLocaleString("ja-JP");
}

function toSafeNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function getPaymentTotal(payment) {
  return toSafeNumber(payment.ticketPrice) + toSafeNumber(payment.ticketFee);
}

function getGoodsTotal(item) {
  return toSafeNumber(item.totalAmount);
}

function getTravelTotal(travel) {
  return toSafeNumber(travel.totalTravelCost);
}

function getEventById(eventId) {
  return events.find((event) => event.id === eventId);
}

function getParticipationById(participationId) {
  return participations.find((participation) => participation.id === participationId);
}

function getEventByParticipationId(participationId) {
  const participation = getParticipationById(participationId);
  if (!participation) return null;
  return getEventById(participation.eventId);
}

function getFormData() {
  return {
    id: editingId || generateId("EV"),
    eventDate: document.getElementById("eventDate").value,
    startTime: document.getElementById("startTime").value,
    groupName: document.getElementById("groupName").value,
    eventType: document.getElementById("eventType").value,
    eventTitle: document.getElementById("eventTitle").value.trim(),
    venue: document.getElementById("venue").value.trim(),
    prefecture: document.getElementById("prefecture").value.trim(),
    applicationDeadline: document.getElementById("applicationDeadline").value,
    lotteryDate: document.getElementById("lotteryDate").value,
    paymentDeadline: document.getElementById("paymentDeadline").value,
    status: document.getElementById("status").value,
    sourceUrl: document.getElementById("sourceUrl").value.trim(),
    memo: document.getElementById("memo").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setFormData(event) {
  editingId = event.id;

  document.getElementById("eventDate").value = event.eventDate || "";
  document.getElementById("startTime").value = event.startTime || "";
  document.getElementById("groupName").value = event.groupName || "";
  document.getElementById("eventType").value = event.eventType || "";
  document.getElementById("eventTitle").value = event.eventTitle || "";
  document.getElementById("venue").value = event.venue || "";
  document.getElementById("prefecture").value = event.prefecture || "";
  document.getElementById("applicationDeadline").value = event.applicationDeadline || "";
  document.getElementById("lotteryDate").value = event.lotteryDate || "";
  document.getElementById("paymentDeadline").value = event.paymentDeadline || "";
  document.getElementById("status").value = event.status || "候補";
  document.getElementById("sourceUrl").value = event.sourceUrl || "";
  document.getElementById("memo").value = event.memo || "";

  document.querySelector("#eventForm .primary-button").textContent = "更新";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  eventForm.reset();
  document.getElementById("status").value = "候補";
  document.querySelector("#eventForm .primary-button").textContent = "登録";
}

function parseImportedEventText(text) {
  const normalized = normalizeImportedText(text);

  return {
    eventTitle: extractEventTitle(normalized),
    eventDate: extractDateByLabels(normalized, ["開催日", "公演日", "日程", "日時"]),
    startTime: extractStartTime(normalized),
    venue: extractVenue(normalized),
    prefecture: extractPrefecture(normalized),
    groupName: extractGroupName(normalized),
    eventType: extractEventType(normalized),
    ticketPrice: extractTicketPrice(normalized),
    applicationDeadline: extractDateByLabels(normalized, ["申込締切", "申込み締切", "受付締切", "応募締切", "締切"]),
    lotteryDate: extractDateByLabels(normalized, ["当落発表", "抽選結果", "当選発表", "落選発表"]),
    paymentDeadline: extractDateByLabels(normalized, ["支払期限", "入金締切", "入金期限", "支払い期限"]),
    sourceUrl: extractSourceUrl(normalized),
    memo: buildImportMemo(normalized)
  };
}

function normalizeImportedText(text) {
  return String(text || "")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractEventTitle(text) {
  const lines = getMeaningfulLines(text);
  const labeled = findLabeledValue(lines, ["イベント名", "公演名", "タイトル"]);
  if (labeled) return cleanupValue(labeled);

  const quoted = text.match(/[「『](.{4,80})[」』]/);
  if (quoted) return cleanupValue(quoted[1]);

  const candidates = lines.filter((line) => {
    if (/https?:\/\//i.test(line)) return false;
    if (/(開催日|公演日|日程|日時|会場|料金|価格|申込|受付|締切|当落|支払|入金|開場|開演|START)/i.test(line)) return false;
    return /(コンサート|ツアー|ライブ|イベント|リリース|発売記念|バースデー|BD|舞台|公演|Hello! Project|ハロプロ)/i.test(line);
  });

  return cleanupValue(candidates.sort((a, b) => b.length - a.length)[0] || "");
}

function extractDateByLabels(text, labels) {
  const lines = getMeaningfulLines(text);

  for (const label of labels) {
    const line = lines.find((item) => item.includes(label));
    const parsed = line ? parseDateText(line) : "";
    if (parsed) return parsed;
  }

  if (labels.includes("開催日") || labels.includes("公演日")) {
    return parseDateText(text);
  }

  return "";
}

function parseDateText(text) {
  const full = text.match(/(20\d{2})\s*[年\/.-]\s*(\d{1,2})\s*[月\/.-]\s*(\d{1,2})\s*日?/);
  if (full) return toDateInputValue(full[1], full[2], full[3]);

  const slash = text.match(/(20\d{2})(\d{2})(\d{2})/);
  if (slash) return toDateInputValue(slash[1], slash[2], slash[3]);

  const noYear = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (noYear) {
    const currentYear = new Date().getFullYear();
    return toDateInputValue(currentYear, noYear[1], noYear[2]);
  }

  return "";
}

function toDateInputValue(year, month, day) {
  const yyyy = String(year).padStart(4, "0");
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function extractStartTime(text) {
  const labeled = text.match(/(?:開演|START|開始)[^\d]*(\d{1,2})\s*[:：時]\s*(\d{2})?/i);
  if (labeled) return toTimeInputValue(labeled[1], labeled[2]);

  const anyTime = text.match(/(\d{1,2})\s*[:：]\s*(\d{2})/);
  if (anyTime) return toTimeInputValue(anyTime[1], anyTime[2]);

  return "";
}

function toTimeInputValue(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute || "00").padStart(2, "0")}`;
}

function extractVenue(text) {
  const lines = getMeaningfulLines(text);
  const labeled = findLabeledValue(lines, ["会場", "場所"]);
  if (labeled) return cleanupValue(labeled);

  const venueLine = lines.find((line) => /(ホール|会館|劇場|武道館|アリーナ|Zepp|Club|STUDIO|シアター)/i.test(line));
  return cleanupValue(venueLine || "");
}

function extractPrefecture(text) {
  const lines = getMeaningfulLines(text);
  const labeled = findLabeledValue(lines, ["都道府県", "エリア"]);
  if (labeled) return cleanupPrefecture(labeled);

  const prefectures = [
    "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬", "埼玉", "千葉",
    "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜", "静岡", "愛知", "三重",
    "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島",
    "香川", "愛媛", "高知", "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"
  ];

  return prefectures.find((prefecture) => text.includes(prefecture)) || "";
}

function cleanupPrefecture(value) {
  return cleanupValue(value).replace(/[都道府県]$/, "");
}

function extractGroupName(text) {
  const groups = [
    "モーニング娘。'26",
    "モーニング娘。",
    "アンジュルム",
    "Juice=Juice",
    "つばきファクトリー",
    "BEYOOOOONDS",
    "OCHA NORMA",
    "ロージークロニクル",
    "ハロプロ研修生"
  ];

  const matched = groups.find((group) => text.includes(group));
  if (!matched) {
    if (/Hello! Project|ハロー！プロジェクト|ハロプロ/.test(text)) return "複数グループ";
    return "";
  }

  if (matched === "モーニング娘。") return "モーニング娘。'26";
  return matched;
}

function extractEventType(text) {
  if (/リリース|発売記念|個別|チェキ|サイン|お話し会|握手/.test(text)) return "RELEASE EVENT";
  if (/バースデー|BD/.test(text)) return "BD EVENT";
  if (/FC|ファンクラブ/.test(text)) return "FC EVENT";
  if (/舞台|ミュージカル|演劇/.test(text)) return "STAGE";
  if (/配信|stream|Streaming/i.test(text)) return "STREAM";
  if (/コンサート|ツアー|ライブ|公演/.test(text)) return "CONCERT";
  if (/イベント/.test(text)) return "OTHER";
  return "";
}

function extractTicketPrice(text) {
  const labeled = text.match(/(?:チケット料金|チケット価格|チケット代|料金|価格|入場料)[^\d]*(\d{1,3}(?:,\d{3})+|\d{4,5})\s*円?/);
  if (labeled) return `${labeled[1].replaceAll(",", "")}円`;

  const yenText = text.match(/(\d{1,3}(?:,\d{3})+|\d{4,5})\s*円/);
  if (yenText) return `${yenText[1].replaceAll(",", "")}円`;

  return "";
}

function extractSourceUrl(text) {
  const match = text.match(/https?:\/\/[^\s"'<>]+/i);
  return match ? match[0] : "";
}

function buildImportMemo(text) {
  const memoLines = [];
  const price = extractTicketPrice(text);
  if (price) memoLines.push(`チケット価格: ${price}`);
  memoLines.push("取り込み補助で解析。登録前に原文確認。");
  return memoLines.join("\n");
}

function getMeaningfulLines(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function findLabeledValue(lines, labels) {
  for (const label of labels) {
    const line = lines.find((item) => item.includes(label));
    if (!line) continue;

    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = line.match(new RegExp(`${escapedLabel}\\s*[：:】\\]]?\\s*(.+)$`));
    if (match) return match[1];
  }

  return "";
}

function cleanupValue(value) {
  return String(value || "")
    .replace(/^[：:】\]\s]+/, "")
    .replace(/\s*(詳細|備考|注意事項).*$/g, "")
    .trim();
}

function renderImportPreview(data) {
  const rows = [
    ["イベント名", data.eventTitle],
    ["開催日", data.eventDate],
    ["開演時間", data.startTime],
    ["会場", data.venue],
    ["都道府県", data.prefecture],
    ["グループ", data.groupName],
    ["種別", data.eventType],
    ["チケット価格", data.ticketPrice],
    ["申込締切", data.applicationDeadline],
    ["当落発表日", data.lotteryDate],
    ["支払期限", data.paymentDeadline],
    ["情報源URL", data.sourceUrl],
    ["メモ", data.memo]
  ];

  importPreviewTableBody.innerHTML = rows.map(([label, value]) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(value || "")}</td>
    </tr>
  `).join("");
}

function clearImportPreview() {
  importPreviewData = null;
  importPreviewTableBody.innerHTML = `<tr><td colspan="2">解析結果はありません。</td></tr>`;
  applyImportButton.disabled = true;
}

function applyImportPreviewToEventForm() {
  if (!importPreviewData) {
    alert("先に解析してください。");
    return;
  }

  const fields = {
    eventDate: "eventDate",
    startTime: "startTime",
    groupName: "groupName",
    eventType: "eventType",
    eventTitle: "eventTitle",
    venue: "venue",
    prefecture: "prefecture",
    applicationDeadline: "applicationDeadline",
    lotteryDate: "lotteryDate",
    paymentDeadline: "paymentDeadline",
    sourceUrl: "sourceUrl"
  };

  Object.entries(fields).forEach(([key, elementId]) => {
    if (!importPreviewData[key]) return;
    document.getElementById(elementId).value = importPreviewData[key];
  });

  if (importPreviewData.memo) {
    const memo = document.getElementById("memo");
    memo.value = [memo.value.trim(), importPreviewData.memo].filter(Boolean).join("\n");
  }

  eventForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getParticipationFormData() {
  return {
    id: editingParticipationId,
    eventId: document.getElementById("participationEventId").value,
    participationStatus: document.getElementById("participationStatus").value,
    ticketCount: document.getElementById("ticketCount").value,
    seatType: document.getElementById("seatType").value,
    ticketSource: document.getElementById("ticketSource").value,
    companion: document.getElementById("companion").value.trim(),
    applicationDate: document.getElementById("applicationDate").value,
    participationMemo: document.getElementById("participationMemo").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setParticipationFormData(participation) {
  editingParticipationId = participation.id;

  document.getElementById("participationId").value = participation.id || "";
  document.getElementById("participationEventId").value = participation.eventId || "";
  document.getElementById("participationStatus").value = participation.participationStatus || "検討中";
  document.getElementById("ticketCount").value = participation.ticketCount || "";
  document.getElementById("seatType").value = participation.seatType || "";
  document.getElementById("ticketSource").value = participation.ticketSource || "";
  document.getElementById("companion").value = participation.companion || "";
  document.getElementById("applicationDate").value = participation.applicationDate || "";
  document.getElementById("participationMemo").value = participation.participationMemo || "";

  document.querySelector("#participationForm .primary-button").textContent = "参加予定を更新";
}

function resetParticipationForm() {
  editingParticipationId = null;
  participationForm.reset();
  document.getElementById("participationId").value = "";
  document.getElementById("participationEventId").value = "";
  document.getElementById("participationStatus").value = "検討中";
}

function getReviewFormData() {
  return {
    reviewId: editingReviewId || document.getElementById("reviewId").value || generateId("RV"),
    eventId: document.getElementById("reviewEventId").value,
    participationId: document.getElementById("reviewParticipationId").value,
    reviewDate: document.getElementById("reviewDate").value,
    groupName: document.getElementById("reviewGroupName").value,
    venue: document.getElementById("reviewVenue").value.trim(),
    seatInfo: document.getElementById("seatInfo").value.trim(),
    referenceNumber: document.getElementById("referenceNumber").value.trim(),
    satisfaction: document.getElementById("reviewSatisfaction").value,
    setlistMemo: document.getElementById("setlistMemo").value.trim(),
    memorableSong: document.getElementById("memorableSong").value.trim(),
    favoriteMemberMemo: document.getElementById("favoriteMemberMemo").value.trim(),
    highlightMemo: document.getElementById("highlightMemo").value.trim(),
    reflectionMemo: document.getElementById("reflectionMemo").value.trim(),
    reviewMemo: document.getElementById("reviewMemo").value.trim(),
    reviewTags: document.getElementById("reviewTags").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setReviewFormData(review) {
  editingReviewId = review.reviewId;

  document.getElementById("reviewId").value = review.reviewId || "";
  document.getElementById("reviewEventId").value = review.eventId || "";
  document.getElementById("reviewParticipationId").value = review.participationId || "";
  document.getElementById("reviewDate").value = review.reviewDate || "";
  document.getElementById("reviewGroupName").value = review.groupName || "";
  document.getElementById("reviewVenue").value = review.venue || "";
  document.getElementById("seatInfo").value = review.seatInfo || "";
  document.getElementById("referenceNumber").value = review.referenceNumber || "";
  document.getElementById("reviewSatisfaction").value = review.satisfaction || "";
  document.getElementById("setlistMemo").value = review.setlistMemo || "";
  document.getElementById("memorableSong").value = review.memorableSong || "";
  document.getElementById("favoriteMemberMemo").value = review.favoriteMemberMemo || "";
  document.getElementById("highlightMemo").value = review.highlightMemo || "";
  document.getElementById("reflectionMemo").value = review.reflectionMemo || "";
  document.getElementById("reviewMemo").value = review.reviewMemo || "";
  document.getElementById("reviewTags").value = review.reviewTags || "";

  document.querySelector("#reviewForm .primary-button").textContent = "履歴を更新";
}

function resetReviewForm() {
  editingReviewId = null;
  reviewForm.reset();
  document.getElementById("reviewId").value = generateId("RV");
  document.getElementById("reviewEventId").value = "";
  document.getElementById("reviewParticipationId").value = "";
  document.getElementById("reviewSatisfaction").value = "";
  document.querySelector("#reviewForm .primary-button").textContent = "履歴を登録";
}

function getPaymentFormData() {
  return {
    id: editingPaymentId,
    participationId: document.getElementById("paymentParticipationId").value,
    paymentItem: document.getElementById("paymentItem").value,
    paymentStatus: document.getElementById("paymentStatus").value,
    paymentDate: document.getElementById("paymentDate").value,
    ticketPrice: document.getElementById("ticketPrice").value,
    ticketFee: document.getElementById("ticketFee").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    paymentVendor: document.getElementById("paymentVendor").value,
    mcyExportStatus: document.getElementById("mcyExportStatus").value,
    paymentMemo: document.getElementById("paymentMemo").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setPaymentFormData(payment) {
  editingPaymentId = payment.id;

  document.getElementById("paymentId").value = payment.id || "";
  document.getElementById("paymentParticipationId").value = payment.participationId || "";
  document.getElementById("paymentItem").value = payment.paymentItem || "チケット代";
  document.getElementById("paymentStatus").value = payment.paymentStatus || "未払い";
  document.getElementById("paymentDate").value = payment.paymentDate || "";
  document.getElementById("ticketPrice").value = payment.ticketPrice || "";
  document.getElementById("ticketFee").value = payment.ticketFee || "";
  document.getElementById("paymentMethod").value = payment.paymentMethod || "";
  document.getElementById("paymentVendor").value = payment.paymentVendor || "";
  document.getElementById("mcyExportStatus").value = payment.mcyExportStatus || "未連携";
  document.getElementById("paymentMemo").value = payment.paymentMemo || "";

  document.querySelector("#paymentForm .primary-button").textContent = "支払いを更新";
}

function resetPaymentForm() {
  editingPaymentId = null;
  paymentForm.reset();
  document.getElementById("paymentId").value = "";
  document.getElementById("paymentParticipationId").value = "";
  document.getElementById("paymentItem").value = "チケット代";
  document.getElementById("paymentStatus").value = "未払い";
  document.getElementById("mcyExportStatus").value = "未連携";
}

function getGoodsFormData() {
  const quantity = toSafeNumber(document.getElementById("goodsQuantity").value);
  const unitPrice = toSafeNumber(document.getElementById("goodsUnitPrice").value);
  const totalAmount = document.getElementById("goodsTotalAmount").value || String(quantity * unitPrice);

  return {
    goodsId: editingGoodsId || document.getElementById("goodsId").value || generateId("GD"),
    eventId: document.getElementById("goodsEventId").value,
    purchaseDate: document.getElementById("goodsPurchaseDate").value,
    groupName: document.getElementById("goodsGroupName").value,
    memberName: document.getElementById("goodsMemberName").value.trim(),
    itemName: document.getElementById("goodsItemName").value.trim(),
    goodsCategory: document.getElementById("goodsCategory").value,
    purchasePlace: document.getElementById("goodsPurchasePlace").value,
    quantity: document.getElementById("goodsQuantity").value,
    unitPrice: document.getElementById("goodsUnitPrice").value,
    totalAmount,
    paymentMethod: document.getElementById("goodsPaymentMethod").value,
    mcyExportStatus: document.getElementById("goodsMcyExportStatus").value,
    goodsMemo: document.getElementById("goodsMemo").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setGoodsFormData(item) {
  editingGoodsId = item.goodsId;

  document.getElementById("goodsId").value = item.goodsId || "";
  document.getElementById("goodsEventId").value = item.eventId || "";
  document.getElementById("goodsPurchaseDate").value = item.purchaseDate || "";
  document.getElementById("goodsGroupName").value = item.groupName || "";
  document.getElementById("goodsMemberName").value = item.memberName || "";
  document.getElementById("goodsItemName").value = item.itemName || "";
  document.getElementById("goodsCategory").value = item.goodsCategory || "写真";
  document.getElementById("goodsPurchasePlace").value = item.purchasePlace || "会場物販";
  document.getElementById("goodsQuantity").value = item.quantity || "1";
  document.getElementById("goodsUnitPrice").value = item.unitPrice || "";
  document.getElementById("goodsTotalAmount").value = item.totalAmount || "";
  document.getElementById("goodsPaymentMethod").value = item.paymentMethod || "";
  document.getElementById("goodsMcyExportStatus").value = item.mcyExportStatus || "未連携";
  document.getElementById("goodsMemo").value = item.goodsMemo || "";

  document.querySelector("#goodsForm .primary-button").textContent = "グッズを更新";
}

function resetGoodsForm() {
  editingGoodsId = null;
  goodsForm.reset();
  document.getElementById("goodsId").value = generateId("GD");
  document.getElementById("goodsEventId").value = "";
  document.getElementById("goodsCategory").value = "写真";
  document.getElementById("goodsPurchasePlace").value = "会場物販";
  document.getElementById("goodsQuantity").value = "1";
  document.getElementById("goodsMcyExportStatus").value = "未連携";
  document.querySelector("#goodsForm .primary-button").textContent = "グッズを登録";
}

function syncGoodsTotalAmount() {
  const quantity = toSafeNumber(document.getElementById("goodsQuantity").value);
  const unitPrice = toSafeNumber(document.getElementById("goodsUnitPrice").value);
  document.getElementById("goodsTotalAmount").value = String(quantity * unitPrice);
}

function getTravelFormData() {
  const transportationCost = toSafeNumber(document.getElementById("transportationCost").value);
  const hotelCost = toSafeNumber(document.getElementById("hotelCost").value);
  const otherTravelCost = toSafeNumber(document.getElementById("otherTravelCost").value);
  const calculatedTotal = transportationCost + hotelCost + otherTravelCost;
  const totalTravelCost = document.getElementById("totalTravelCost").value || String(calculatedTotal);

  return {
    travelId: editingTravelId || document.getElementById("travelId").value || generateId("TR"),
    eventId: document.getElementById("travelEventId").value,
    departureDate: document.getElementById("departureDate").value,
    returnDate: document.getElementById("returnDate").value,
    transportationType: document.getElementById("transportationType").value,
    departurePlace: document.getElementById("departurePlace").value.trim(),
    arrivalPlace: document.getElementById("arrivalPlace").value.trim(),
    transportationCost: document.getElementById("transportationCost").value,
    hotelName: document.getElementById("hotelName").value.trim(),
    checkInDate: document.getElementById("checkInDate").value,
    checkOutDate: document.getElementById("checkOutDate").value,
    hotelCost: document.getElementById("hotelCost").value,
    otherTravelCost: document.getElementById("otherTravelCost").value,
    totalTravelCost,
    paymentDate: document.getElementById("travelPaymentDate").value,
    paymentMethod: document.getElementById("travelPaymentMethod").value,
    bookingStatus: document.getElementById("bookingStatus").value,
    mcyExportStatus: document.getElementById("travelMcyExportStatus").value,
    travelMemo: document.getElementById("travelMemo").value.trim(),
    updatedAt: new Date().toISOString()
  };
}

function setTravelFormData(travel) {
  editingTravelId = travel.travelId;

  document.getElementById("travelId").value = travel.travelId || "";
  document.getElementById("travelEventId").value = travel.eventId || "";
  document.getElementById("departureDate").value = travel.departureDate || "";
  document.getElementById("returnDate").value = travel.returnDate || "";
  document.getElementById("transportationType").value = travel.transportationType || "";
  document.getElementById("departurePlace").value = travel.departurePlace || "";
  document.getElementById("arrivalPlace").value = travel.arrivalPlace || "";
  document.getElementById("transportationCost").value = travel.transportationCost || "";
  document.getElementById("hotelName").value = travel.hotelName || "";
  document.getElementById("checkInDate").value = travel.checkInDate || "";
  document.getElementById("checkOutDate").value = travel.checkOutDate || "";
  document.getElementById("hotelCost").value = travel.hotelCost || "";
  document.getElementById("otherTravelCost").value = travel.otherTravelCost || "";
  document.getElementById("totalTravelCost").value = travel.totalTravelCost || "";
  document.getElementById("travelPaymentDate").value = travel.paymentDate || "";
  document.getElementById("travelPaymentMethod").value = travel.paymentMethod || "";
  document.getElementById("bookingStatus").value = travel.bookingStatus || "未予約";
  document.getElementById("travelMcyExportStatus").value = travel.mcyExportStatus || "未連携";
  document.getElementById("travelMemo").value = travel.travelMemo || "";

  document.querySelector("#travelForm .primary-button").textContent = "遠征を更新";
}

function resetTravelForm() {
  editingTravelId = null;
  travelForm.reset();
  document.getElementById("travelId").value = generateId("TR");
  document.getElementById("travelEventId").value = "";
  document.getElementById("transportationType").value = "";
  document.getElementById("bookingStatus").value = "未予約";
  document.getElementById("travelMcyExportStatus").value = "未連携";
  document.querySelector("#travelForm .primary-button").textContent = "遠征を登録";
}

function syncTravelTotalAmount() {
  const transportationCost = toSafeNumber(document.getElementById("transportationCost").value);
  const hotelCost = toSafeNumber(document.getElementById("hotelCost").value);
  const otherTravelCost = toSafeNumber(document.getElementById("otherTravelCost").value);
  const total = transportationCost + hotelCost + otherTravelCost;
  document.getElementById("totalTravelCost").value = String(total);
}

function formatDate(value) {
  if (!value) return "";
  return value;
}

function parseLocalDate(value) {
  if (!value) return null;
  const parts = String(value).split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function getTodayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getDaysUntil(dateValue) {
  const target = parseLocalDate(dateValue);
  if (!target) return null;

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - getTodayDateOnly().getTime()) / dayMs);
}

function getPriority(daysUntil) {
  if (daysUntil < 0) return "期限切れ";
  if (daysUntil === 0) return "今日";
  if (daysUntil <= 3) return "3日以内";
  if (daysUntil <= 7) return "7日以内";
  if (daysUntil <= 30) return "30日以内";
  return "通常";
}

function formatDaysUntil(daysUntil) {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}日超過`;
  if (daysUntil === 0) return "今日";
  return `あと${daysUntil}日`;
}

function getParticipationsByEventId(eventId) {
  return participations.filter((participation) => participation.eventId === eventId);
}

function getPaymentsByEventId(eventId) {
  const participationIds = new Set(getParticipationsByEventId(eventId).map((participation) => participation.id));
  return payments.filter((payment) => participationIds.has(payment.participationId));
}

function populateGoodsEventSelect() {
  const currentValue = document.getElementById("goodsEventId").value;
  const options = events
    .slice()
    .sort((a, b) => (a.eventDate || "9999-12-31").localeCompare(b.eventDate || "9999-12-31"))
    .map((event) => {
      const label = [event.eventDate, event.groupName, event.eventTitle].filter(Boolean).join(" / ");
      return `<option value="${escapeAttribute(event.id)}">${escapeHtml(label)}</option>`;
    });

  document.getElementById("goodsEventId").innerHTML = `<option value="">イベント未紐付け</option>${options.join("")}`;
  document.getElementById("goodsEventId").value = events.some((event) => event.id === currentValue) ? currentValue : "";
}

function populateTravelEventSelect() {
  const currentValue = document.getElementById("travelEventId").value;
  const options = events
    .slice()
    .sort((a, b) => (a.eventDate || "9999-12-31").localeCompare(b.eventDate || "9999-12-31"))
    .map((event) => {
      const label = [event.eventDate, event.groupName, event.eventTitle, event.venue].filter(Boolean).join(" / ");
      return `<option value="${escapeAttribute(event.id)}">${escapeHtml(label)}</option>`;
    });

  document.getElementById("travelEventId").innerHTML = `<option value="">イベント未紐付け</option>${options.join("")}`;
  document.getElementById("travelEventId").value = events.some((event) => event.id === currentValue) ? currentValue : "";
}

function populateReviewEventSelect() {
  const currentValue = document.getElementById("reviewEventId").value;
  const options = events
    .slice()
    .sort((a, b) => (a.eventDate || "9999-12-31").localeCompare(b.eventDate || "9999-12-31"))
    .map((event) => {
      const label = [event.eventDate, event.groupName, event.eventTitle, event.venue].filter(Boolean).join(" / ");
      return `<option value="${escapeAttribute(event.id)}">${escapeHtml(label)}</option>`;
    });

  document.getElementById("reviewEventId").innerHTML = `<option value="">イベント未紐付け</option>${options.join("")}`;
  document.getElementById("reviewEventId").value = events.some((event) => event.id === currentValue) ? currentValue : "";
}

function populateReviewParticipationSelect() {
  const currentValue = document.getElementById("reviewParticipationId").value;
  const options = participations
    .slice()
    .sort((a, b) => {
      const eventA = getEventById(a.eventId);
      const eventB = getEventById(b.eventId);
      return (eventA?.eventDate || "9999-12-31").localeCompare(eventB?.eventDate || "9999-12-31");
    })
    .map((participation) => {
      const event = getEventById(participation.eventId);
      const label = [
        participation.id,
        event?.eventDate,
        event?.groupName,
        event?.eventTitle
      ].filter(Boolean).join(" / ");
      return `<option value="${escapeAttribute(participation.id)}">${escapeHtml(label)}</option>`;
    });

  document.getElementById("reviewParticipationId").innerHTML = `<option value="">参加予定未紐付け</option>${options.join("")}`;
  document.getElementById("reviewParticipationId").value = participations.some((item) => item.id === currentValue) ? currentValue : "";
}

function applyEventToReviewForm(event) {
  if (!event) return;
  document.getElementById("reviewEventId").value = event.id || "";
  document.getElementById("reviewDate").value = event.eventDate || document.getElementById("reviewDate").value;
  document.getElementById("reviewGroupName").value = event.groupName || document.getElementById("reviewGroupName").value;
  document.getElementById("reviewVenue").value = event.venue || document.getElementById("reviewVenue").value;
}

function applyParticipationToReviewForm(participation) {
  if (!participation) return;
  document.getElementById("reviewParticipationId").value = participation.id || "";
  const event = getEventById(participation.eventId);
  if (event) {
    applyEventToReviewForm(event);
  }
}

function hasSuppressedParticipationStatus(eventId) {
  return getParticipationsByEventId(eventId).some((participation) =>
    ["参加済", "見送り", "落選"].includes(participation.participationStatus)
  );
}

function buildReminderStatus(event, participation, payment) {
  const statuses = [];
  if (event?.status) statuses.push(`イベント:${event.status}`);
  if (participation?.participationStatus) statuses.push(`参加:${participation.participationStatus}`);
  if (payment?.paymentStatus) statuses.push(`支払い:${payment.paymentStatus}`);
  return statuses.join(" / ");
}

function isEventReminderComplete(type, event) {
  if (type === "申込締切") return ["申込済", "当選", "落選", "見送り"].includes(event.status);
  if (type === "当落発表") return ["当選", "落選", "見送り"].includes(event.status);
  if (type === "支払期限") {
    const eventPayments = getPaymentsByEventId(event.id);
    return ["落選", "見送り"].includes(event.status) || eventPayments.some((payment) => payment.paymentStatus === "支払済");
  }
  if (type === "公演日") return event.eventDate && getDaysUntil(event.eventDate) < 0;
  return false;
}

function addReminder(rows, type, dateValue, event, participation, payment, complete) {
  if (!dateValue || !event) return;

  const daysUntil = getDaysUntil(dateValue);
  if (daysUntil === null) return;

  rows.push({
    type,
    date: dateValue,
    daysUntil,
    priority: getPriority(daysUntil),
    groupName: event.groupName || "",
    eventTitle: event.eventTitle || "",
    venue: event.venue || "",
    statusText: buildReminderStatus(event, participation, payment),
    eventId: event.id,
    participationId: participation?.id || "",
    paymentId: payment?.id || "",
    complete
  });
}

function buildReminderRows() {
  const rows = [];

  events.forEach((event) => {
    const relatedParticipations = getParticipationsByEventId(event.id);
    const primaryParticipation = relatedParticipations[0] || null;
    const suppressed = hasSuppressedParticipationStatus(event.id);
    const hasPaymentDeadlinePayment = getPaymentsByEventId(event.id).some((payment) => payment.paymentStatus === "未払い");

    if (!suppressed) {
      addReminder(rows, "申込締切", event.applicationDeadline, event, primaryParticipation, null, isEventReminderComplete("申込締切", event));
      addReminder(rows, "当落発表", event.lotteryDate, event, primaryParticipation, null, isEventReminderComplete("当落発表", event));

      if (!hasPaymentDeadlinePayment) {
        addReminder(rows, "支払期限", event.paymentDeadline, event, primaryParticipation, null, isEventReminderComplete("支払期限", event));
      }
    }

    addReminder(rows, "公演日", event.eventDate, event, primaryParticipation, null, isEventReminderComplete("公演日", event));
  });

  payments.forEach((payment) => {
    if (payment.paymentStatus !== "未払い") return;

    const participation = getParticipationById(payment.participationId);
    const event = participation ? getEventById(participation.eventId) : null;
    if (!event || !event.paymentDeadline) return;
    if (["参加済", "見送り", "落選"].includes(participation.participationStatus)) return;

    addReminder(rows, "支払期限", event.paymentDeadline, event, participation, payment, false);
  });

  return rows.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.type.localeCompare(b.type);
  });
}

function getFilteredReminderRows() {
  const target = reminderTargetFilter.value;
  const type = reminderTypeFilter.value;

  return buildReminderRows().filter((row) => {
    const matchesType = !type || row.type === type;
    if (!matchesType) return false;

    if (target === "expired") return row.daysUntil < 0;
    if (target === "today") return row.daysUntil === 0;
    if (target === "within7") return row.daysUntil >= 0 && row.daysUntil <= 7;
    if (target === "within30") return row.daysUntil >= 0 && row.daysUntil <= 30;
    if (target === "incomplete") return !row.complete;
    return true;
  });
}

function renderReminderActions(row) {
  const buttons = [`<button class="small-button" data-action="edit-event" data-id="${escapeAttribute(row.eventId)}">イベント編集</button>`];

  if (row.participationId) {
    buttons.push(`<button class="small-button" data-action="edit-participation" data-id="${escapeAttribute(row.participationId)}">参加編集</button>`);
  }

  if (row.paymentId) {
    buttons.push(`<button class="small-button" data-action="edit-payment" data-id="${escapeAttribute(row.paymentId)}">支払い編集</button>`);
  }

  return `<div class="action-buttons">${buttons.join("")}</div>`;
}

function renderReminders() {
  const rows = getFilteredReminderRows();

  reminderTableBody.innerHTML = "";

  if (rows.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9">期限表示対象はありません。</td>`;
    reminderTableBody.appendChild(row);
  } else {
    rows.forEach((rowData) => {
      const row = document.createElement("tr");
      row.className = `reminder-priority-${rowData.priority}`;

      row.innerHTML = `
        <td>${escapeHtml(rowData.type)}</td>
        <td>${escapeHtml(formatDate(rowData.date))}</td>
        <td>${escapeHtml(formatDaysUntil(rowData.daysUntil))}</td>
        <td>${escapeHtml(rowData.groupName)}</td>
        <td>${escapeHtml(rowData.eventTitle)}</td>
        <td>${escapeHtml(rowData.venue)}</td>
        <td>${escapeHtml(rowData.statusText)}</td>
        <td>${escapeHtml(rowData.priority)}</td>
        <td>${renderReminderActions(rowData)}</td>
      `;

      reminderTableBody.appendChild(row);
    });
  }

  reminderCount.textContent = String(rows.length);
}

function getFilteredEvents() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  return events
    .filter((event) => {
      const text = [
        event.eventTitle,
        event.groupName,
        event.venue,
        event.prefecture,
        event.eventType,
        event.memo
      ].join(" ").toLowerCase();

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesStatus = !selectedStatus || event.status === selectedStatus;

      return matchesKeyword && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.eventDate || "9999-12-31";
      const dateB = b.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getFilteredParticipations() {
  const keyword = participationSearchInput.value.trim().toLowerCase();
  const selectedStatus = participationStatusFilter.value;

  return participations
    .map((participation) => {
      const event = getEventById(participation.eventId);
      return { ...participation, event };
    })
    .filter((item) => {
      const event = item.event;
      const text = [
        event?.eventTitle,
        event?.groupName,
        event?.venue,
        event?.prefecture,
        item.companion,
        item.participationMemo
      ].join(" ").toLowerCase();

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesStatus = !selectedStatus || item.participationStatus === selectedStatus;

      return matchesKeyword && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.event?.eventDate || "9999-12-31";
      const dateB = b.event?.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getFilteredPayments() {
  const keyword = paymentSearchInput.value.trim().toLowerCase();
  const selectedStatus = paymentStatusFilter.value;

  return payments
    .map((payment) => {
      const participation = getParticipationById(payment.participationId);
      const event = participation ? getEventById(participation.eventId) : null;
      return { ...payment, participation, event };
    })
    .filter((item) => {
      const text = [
        item.event?.eventTitle,
        item.event?.groupName,
        item.event?.venue,
        item.paymentItem,
        item.paymentVendor,
        item.paymentMethod,
        item.paymentMemo
      ].join(" ").toLowerCase();

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesStatus = !selectedStatus || item.paymentStatus === selectedStatus;

      return matchesKeyword && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.paymentDate || a.event?.eventDate || "9999-12-31";
      const dateB = b.paymentDate || b.event?.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getFilteredGoods() {
  const keyword = goodsSearchInput.value.trim().toLowerCase();
  const selectedGroup = goodsGroupFilter.value;
  const selectedMcyStatus = goodsMcyStatusFilter.value;

  return goods
    .map((item) => {
      const event = getEventById(item.eventId);
      return { ...item, event };
    })
    .filter((item) => {
      const text = [
        item.goodsId,
        item.event?.eventDate,
        item.event?.eventTitle,
        item.event?.venue,
        item.groupName,
        item.memberName,
        item.itemName,
        item.goodsCategory,
        item.purchasePlace,
        item.paymentMethod,
        item.goodsMemo
      ].join(" ").toLowerCase();

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesGroup = !selectedGroup || item.groupName === selectedGroup;
      const matchesMcyStatus = !selectedMcyStatus || item.mcyExportStatus === selectedMcyStatus;

      return matchesKeyword && matchesGroup && matchesMcyStatus;
    })
    .sort((a, b) => {
      const dateA = a.purchaseDate || "9999-12-31";
      const dateB = b.purchaseDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getFilteredTravels() {
  const keyword = travelSearchInput.value.trim().toLowerCase();
  const selectedBookingStatus = travelBookingStatusFilter.value;
  const selectedMcyStatus = travelMcyStatusFilter.value;

  return travels
    .map((travel) => {
      const event = getEventById(travel.eventId);
      return { ...travel, event };
    })
    .filter((travel) => {
      const text = [
        travel.travelId,
        travel.event?.eventDate,
        travel.event?.eventTitle,
        travel.event?.venue,
        travel.departureDate,
        travel.returnDate,
        travel.transportationType,
        travel.departurePlace,
        travel.arrivalPlace,
        travel.hotelName,
        travel.paymentMethod,
        travel.travelMemo
      ].join(" ").toLowerCase();

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesBookingStatus = !selectedBookingStatus || travel.bookingStatus === selectedBookingStatus;
      const matchesMcyStatus = !selectedMcyStatus || travel.mcyExportStatus === selectedMcyStatus;

      return matchesKeyword && matchesBookingStatus && matchesMcyStatus;
    })
    .sort((a, b) => {
      const dateA = a.departureDate || a.event?.eventDate || "9999-12-31";
      const dateB = b.departureDate || b.event?.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getFilteredReviews() {
  const keyword = reviewSearchInput.value.trim().toLowerCase();
  const selectedGroup = reviewGroupFilter.value;
  const selectedSatisfaction = reviewSatisfactionFilter.value;
  const tagKeyword = reviewTagSearchInput.value.trim().toLowerCase();

  return reviews
    .map((review) => {
      const participation = getParticipationById(review.participationId);
      const event = getEventById(review.eventId) || (participation ? getEventById(participation.eventId) : null);
      return { ...review, participation, event };
    })
    .filter((review) => {
      const groupName = review.groupName || review.event?.groupName || "";
      const venue = review.venue || review.event?.venue || "";
      const text = [
        review.reviewId,
        review.reviewDate,
        review.event?.eventDate,
        review.event?.eventTitle,
        groupName,
        venue,
        review.seatInfo,
        review.referenceNumber,
        review.memorableSong,
        review.setlistMemo,
        review.favoriteMemberMemo,
        review.highlightMemo,
        review.reflectionMemo,
        review.reviewMemo,
        review.reviewTags
      ].join(" ").toLowerCase();
      const tags = String(review.reviewTags || "").toLowerCase();
      const satisfaction = review.satisfaction || "";

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesGroup = !selectedGroup || groupName === selectedGroup;
      const matchesSatisfaction =
        !selectedSatisfaction ||
        (selectedSatisfaction === "unrated" ? !satisfaction : satisfaction === selectedSatisfaction);
      const matchesTag = !tagKeyword || tags.includes(tagKeyword);

      return matchesKeyword && matchesGroup && matchesSatisfaction && matchesTag;
    })
    .sort((a, b) => {
      const dateA = a.reviewDate || a.event?.eventDate || "9999-12-31";
      const dateB = b.reviewDate || b.event?.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function renderEvents() {
  const filtered = getFilteredEvents();

  eventTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="10">該当するイベントはありません。</td>`;
    eventTableBody.appendChild(row);
  } else {
    filtered.forEach((event) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${escapeHtml(event.id)}</td>
        <td>${escapeHtml(formatDate(event.eventDate))}</td>
        <td>${escapeHtml(event.startTime || "")}</td>
        <td>${escapeHtml(event.groupName)}</td>
        <td>${escapeHtml(event.eventType)}</td>
        <td>${renderTitleCell(event)}</td>
        <td>${escapeHtml(event.venue || "")}</td>
        <td>${escapeHtml(formatDate(event.applicationDeadline))}</td>
        <td><span class="status status-${escapeHtml(event.status)}">${escapeHtml(event.status)}</span></td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="add-participation" data-id="${event.id}">参加予定へ</button>
            <button class="small-button" data-action="edit" data-id="${event.id}">編集</button>
            <button class="small-button" data-action="delete" data-id="${event.id}">削除</button>
          </div>
        </td>
      `;

      eventTableBody.appendChild(row);
    });
  }

  eventCount.textContent = String(filtered.length);
}

function renderParticipations() {
  const filtered = getFilteredParticipations();

  participationTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="12">参加予定はありません。</td>`;
    participationTableBody.appendChild(row);
  } else {
    filtered.forEach((participation) => {
      const event = participation.event;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(participation.id)}</td>
        <td>${escapeHtml(event?.eventDate || "")}</td>
        <td>${escapeHtml(event?.startTime || "")}</td>
        <td>${escapeHtml(event?.groupName || "")}</td>
        <td>${event ? renderTitleCell(event) : "イベント不明"}</td>
        <td>${escapeHtml(event?.venue || "")}</td>
        <td><span class="status status-${escapeHtml(participation.participationStatus)}">${escapeHtml(participation.participationStatus)}</span></td>
        <td>${escapeHtml(participation.ticketCount || "")}</td>
        <td>${escapeHtml(participation.seatType || "")}</td>
        <td>${escapeHtml(participation.ticketSource || "")}</td>
        <td>${escapeHtml(participation.companion || "")}</td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="add-payment" data-id="${participation.id}">支払いへ</button>
            <button class="small-button" data-action="add-review" data-id="${participation.id}">履歴へ</button>
            <button class="small-button" data-action="edit-participation" data-id="${participation.id}">編集</button>
            <button class="small-button" data-action="delete-participation" data-id="${participation.id}">削除</button>
          </div>
        </td>
      `;

      participationTableBody.appendChild(row);
    });
  }

  participationCount.textContent = String(filtered.length);
}

function renderPayments() {
  const filtered = getFilteredPayments();

  paymentTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="15">支払い情報はありません。</td>`;
    paymentTableBody.appendChild(row);
  } else {
    filtered.forEach((payment) => {
      const event = payment.event;
      const total = getPaymentTotal(payment);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(payment.id)}</td>
        <td>${escapeHtml(payment.paymentDate || "")}</td>
        <td>${escapeHtml(event?.eventDate || "")}</td>
        <td>${escapeHtml(event?.groupName || "")}</td>
        <td>${event ? renderTitleCell(event) : "イベント不明"}</td>
        <td>${escapeHtml(event?.venue || "")}</td>
        <td>${escapeHtml(payment.paymentItem || "")}</td>
        <td class="money">${yen(payment.ticketPrice)}</td>
        <td class="money">${yen(payment.ticketFee)}</td>
        <td class="money">${yen(total)}</td>
        <td>${escapeHtml(payment.paymentMethod || "")}</td>
        <td>${escapeHtml(payment.paymentVendor || "")}</td>
        <td><span class="status status-${escapeHtml(payment.paymentStatus)}">${escapeHtml(payment.paymentStatus)}</span></td>
        <td><span class="status status-${escapeHtml(payment.mcyExportStatus)}">${escapeHtml(payment.mcyExportStatus)}</span></td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="edit-payment" data-id="${payment.id}">編集</button>
            <button class="small-button" data-action="delete-payment" data-id="${payment.id}">削除</button>
          </div>
        </td>
      `;

      paymentTableBody.appendChild(row);
    });
  }

  const totalAmount = filtered.reduce((sum, payment) => sum + getPaymentTotal(payment), 0);
  paymentCount.textContent = String(filtered.length);
  paymentTotal.textContent = yen(totalAmount);
}

function renderGoods() {
  const filtered = getFilteredGoods();

  goodsTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="14">グッズ情報はありません。</td>`;
    goodsTableBody.appendChild(row);
  } else {
    filtered.forEach((item) => {
      const event = item.event;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(item.goodsId)}</td>
        <td>${escapeHtml(item.purchaseDate || "")}</td>
        <td>${event ? renderGoodsEventCell(event) : "未紐付け"}</td>
        <td>${escapeHtml(item.groupName || "")}</td>
        <td>${escapeHtml(item.memberName || "")}</td>
        <td>${escapeHtml(item.itemName || "")}</td>
        <td>${escapeHtml(item.goodsCategory || "")}</td>
        <td>${escapeHtml(item.purchasePlace || "")}</td>
        <td class="money">${escapeHtml(item.quantity || "")}</td>
        <td class="money">${yen(item.unitPrice)}</td>
        <td class="money">${yen(item.totalAmount)}</td>
        <td>${escapeHtml(item.paymentMethod || "")}</td>
        <td><span class="status status-${escapeHtml(item.mcyExportStatus)}">${escapeHtml(item.mcyExportStatus)}</span></td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="edit-goods" data-id="${escapeAttribute(item.goodsId)}">編集</button>
            <button class="small-button" data-action="delete-goods" data-id="${escapeAttribute(item.goodsId)}">削除</button>
          </div>
        </td>
      `;

      goodsTableBody.appendChild(row);
    });
  }

  const totalAmount = filtered.reduce((sum, item) => sum + getGoodsTotal(item), 0);
  goodsCount.textContent = String(filtered.length);
  goodsTotal.textContent = yen(totalAmount);
}

function renderTravels() {
  const filtered = getFilteredTravels();

  travelTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="16">遠征情報はありません。</td>`;
    travelTableBody.appendChild(row);
  } else {
    filtered.forEach((travel) => {
      const event = travel.event;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(travel.travelId)}</td>
        <td>${event ? renderTravelEventCell(event) : "未紐付け"}</td>
        <td>${escapeHtml(event?.eventDate || "")}</td>
        <td>${escapeHtml(event?.venue || "")}</td>
        <td>${escapeHtml(travel.departureDate || "")}</td>
        <td>${escapeHtml(travel.returnDate || "")}</td>
        <td>${escapeHtml(travel.transportationType || "")}</td>
        <td class="money">${yen(travel.transportationCost)}</td>
        <td>${escapeHtml(travel.hotelName || "")}</td>
        <td class="money">${yen(travel.hotelCost)}</td>
        <td class="money">${yen(travel.otherTravelCost)}</td>
        <td class="money">${yen(travel.totalTravelCost)}</td>
        <td>${escapeHtml(travel.paymentMethod || "")}</td>
        <td><span class="status status-${escapeHtml(travel.bookingStatus)}">${escapeHtml(travel.bookingStatus || "")}</span></td>
        <td><span class="status status-${escapeHtml(travel.mcyExportStatus)}">${escapeHtml(travel.mcyExportStatus || "")}</span></td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="edit-travel" data-id="${escapeAttribute(travel.travelId)}">編集</button>
            <button class="small-button" data-action="delete-travel" data-id="${escapeAttribute(travel.travelId)}">削除</button>
          </div>
        </td>
      `;

      travelTableBody.appendChild(row);
    });
  }

  const totalAmount = filtered.reduce((sum, travel) => sum + getTravelTotal(travel), 0);
  travelCount.textContent = String(filtered.length);
  travelTotal.textContent = yen(totalAmount);
}

function renderReviews() {
  const filtered = getFilteredReviews();

  reviewTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="11">参加履歴はありません。</td>`;
    reviewTableBody.appendChild(row);
  } else {
    filtered.forEach((review) => {
      const event = review.event;
      const groupName = review.groupName || event?.groupName || "";
      const venue = review.venue || event?.venue || "";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(review.reviewId)}</td>
        <td>${escapeHtml(review.reviewDate || event?.eventDate || "")}</td>
        <td>${event ? renderReviewEventCell(event) : "未紐付け"}</td>
        <td>${escapeHtml(groupName)}</td>
        <td>${escapeHtml(venue)}</td>
        <td>${escapeHtml(review.seatInfo || "")}</td>
        <td>${escapeHtml(review.referenceNumber || "")}</td>
        <td>${escapeHtml(review.satisfaction || "未評価")}</td>
        <td>${escapeHtml(review.memorableSong || "")}</td>
        <td>${review.favoriteMemberMemo ? "有" : "無"}</td>
        <td>
          <div class="action-buttons">
            <button class="small-button" data-action="edit-review" data-id="${escapeAttribute(review.reviewId)}">編集</button>
            <button class="small-button" data-action="delete-review" data-id="${escapeAttribute(review.reviewId)}">削除</button>
          </div>
        </td>
      `;

      reviewTableBody.appendChild(row);
    });
  }

  const rated = filtered
    .map((review) => Number(review.satisfaction || 0))
    .filter((value) => value >= 1 && value <= 5);
  const average = rated.length ? (rated.reduce((sum, value) => sum + value, 0) / rated.length).toFixed(1) : "-";
  const max = rated.length ? String(Math.max(...rated)) : "-";
  const reviewDates = filtered
    .map((review) => review.reviewDate || review.event?.eventDate || "")
    .filter(Boolean)
    .sort();
  const latest = reviewDates.length ? reviewDates[reviewDates.length - 1] : "-";

  reviewCount.textContent = String(filtered.length);
  reviewAverageSatisfaction.textContent = average;
  reviewMaxSatisfaction.textContent = max;
  reviewLatestDate.textContent = latest;
}

function renderTitleCell(event) {
  const title = escapeHtml(event.eventTitle);
  if (!event.sourceUrl) return title;

  return `<a href="${escapeAttribute(event.sourceUrl)}" target="_blank" rel="noopener noreferrer">${title}</a>`;
}

function renderGoodsEventCell(event) {
  const dateText = event.eventDate ? `${escapeHtml(event.eventDate)} / ` : "";
  return `${dateText}${renderTitleCell(event)}`;
}

function renderTravelEventCell(event) {
  return renderTitleCell(event);
}

function renderReviewEventCell(event) {
  const dateText = event.eventDate ? `${escapeHtml(event.eventDate)} / ` : "";
  const venueText = event.venue ? ` / ${escapeHtml(event.venue)}` : "";
  return `${dateText}${renderTitleCell(event)}${venueText}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function upsertEvent(event) {
  const index = events.findIndex((item) => item.id === event.id);

  if (index >= 0) {
    events[index] = event;
  } else {
    events.push({
      ...event,
      createdAt: new Date().toISOString()
    });
  }

  saveEvents();
  renderEvents();
  renderParticipations();
  renderPayments();
  populateGoodsEventSelect();
  renderGoods();
  populateTravelEventSelect();
  renderTravels();
  populateReviewEventSelect();
  populateReviewParticipationSelect();
  renderReviews();
  renderMcyPreview();
  renderReminders();
}

function upsertParticipation(participation) {
  const index = participations.findIndex((item) => item.id === participation.id);

  if (index >= 0) {
    participations[index] = participation;
  } else {
    participations.push({
      ...participation,
      createdAt: new Date().toISOString()
    });
  }

  saveParticipations();
  renderParticipations();
  renderPayments();
  populateReviewParticipationSelect();
  renderReviews();
  renderReminders();
}

function upsertPayment(payment) {
  const index = payments.findIndex((item) => item.id === payment.id);

  if (index >= 0) {
    payments[index] = payment;
  } else {
    payments.push({
      ...payment,
      createdAt: new Date().toISOString()
    });
  }

  savePayments(); 
  renderPayments();
  renderMcyPreview();
  renderReminders();
}

function upsertGoods(item) {
  const index = goods.findIndex((goodsItem) => goodsItem.goodsId === item.goodsId);

  if (index >= 0) {
    goods[index] = item;
  } else {
    goods.push({
      ...item,
      createdAt: new Date().toISOString()
    });
  }

  saveGoods();
  renderGoods();
  renderMcyPreview();
}

function upsertTravel(travel) {
  const index = travels.findIndex((travelItem) => travelItem.travelId === travel.travelId);

  if (index >= 0) {
    travels[index] = travel;
  } else {
    travels.push({
      ...travel,
      createdAt: new Date().toISOString()
    });
  }

  saveTravels();
  renderTravels();
  renderMcyPreview();
}

function upsertReview(review) {
  const index = reviews.findIndex((reviewItem) => reviewItem.reviewId === review.reviewId);

  if (index >= 0) {
    reviews[index] = {
      ...review,
      createdAt: reviews[index].createdAt || new Date().toISOString()
    };
  } else {
    reviews.push({
      ...review,
      createdAt: new Date().toISOString()
    });
  }

  saveReviews();
  renderReviews();
}

function addParticipationFromEvent(eventId) {
  const event = getEventById(eventId);
  if (!event) return;

  const existing = participations.find((item) => item.eventId === eventId);
  if (existing) {
    const ok = confirm("このイベントはすでに参加予定に登録されています。\n編集画面を開きますか？");
    if (ok) {
      setParticipationFormData(existing);
      scrollToParticipationForm();
    }
    return;
  }

  const participation = {
    id: generateId("PT"),
    eventId,
    participationStatus: "申込予定",
    ticketCount: "1",
    seatType: "",
    ticketSource: "",
    companion: "",
    applicationDate: "",
    participationMemo: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  participations.push(participation);
  saveParticipations();
  renderParticipations();
  populateReviewParticipationSelect();
  renderReminders();
  setParticipationFormData(participation);
  scrollToParticipationForm();

  alert(`参加予定に登録しました。\n${event.eventTitle}`);
}

function addPaymentFromParticipation(participationId) {
  const participation = getParticipationById(participationId);
  if (!participation) return;

  const event = getEventByParticipationId(participationId);
  const ticketSource = participation.ticketSource || "";
  const existing = payments.find((item) => item.participationId === participationId && item.paymentItem === "チケット代");

  if (existing) {
    const ok = confirm("この参加予定には既にチケット代の支払い情報があります。\n編集画面を開きますか？");
    if (ok) {
      setPaymentFormData(existing);
      scrollToPaymentForm();
    }
    return;
  }

  const payment = {
    id: generateId("PY"),
    participationId,
    paymentItem: "チケット代",
    paymentStatus: "未払い",
    paymentDate: "",
    ticketPrice: "",
    ticketFee: "",
    paymentMethod: "",
    paymentVendor: ticketSource,
    mcyExportStatus: "未連携",
    paymentMemo: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  payments.push(payment);
  savePayments();
  renderPayments();
  renderReminders();
  setPaymentFormData(payment);
  scrollToPaymentForm();

  alert(`支払い情報を作成しました。\n${event?.eventTitle || "イベント不明"}`);
}

function addReviewFromParticipation(participationId) {
  const participation = getParticipationById(participationId);
  if (!participation) return;

  const existing = reviews.find((review) => review.participationId === participationId);
  if (existing) {
    const ok = confirm("この参加予定には既に参加履歴があります。\n既存履歴の編集画面を開きますか？");
    if (ok) {
      setReviewFormData(existing);
      scrollToReviewForm();
    }
    return;
  }

  const event = getEventById(participation.eventId);
  const review = {
    reviewId: generateId("RV"),
    eventId: participation.eventId || "",
    participationId,
    reviewDate: event?.eventDate || "",
    groupName: event?.groupName || "",
    venue: event?.venue || "",
    seatInfo: participation.seatType || "",
    referenceNumber: "",
    satisfaction: "",
    setlistMemo: "",
    memorableSong: "",
    favoriteMemberMemo: "",
    highlightMemo: "",
    reflectionMemo: "",
    reviewMemo: "",
    reviewTags: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (participation.participationStatus !== "参加済") {
    const ok = confirm("参加状態を参加済に更新しますか？");
    if (ok) {
      participation.participationStatus = "参加済";
      participation.updatedAt = new Date().toISOString();
      saveParticipations();
      renderParticipations();
      renderReminders();
    }
  }

  reviews.push(review);
  saveReviews();
  renderReviews();
  setReviewFormData(review);
  scrollToReviewForm();

  alert(`参加履歴を作成しました。\n${event?.eventTitle || "イベント未紐付け"}`);
}

function scrollToParticipationForm() {
  participationForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToPaymentForm() {
  paymentForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToGoodsForm() {
  goodsForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTravelForm() {
  travelForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToReviewForm() {
  reviewForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteEvent(id) {
  const target = events.find((event) => event.id === id);
  if (!target) return;

  const linkedCount = participations.filter((item) => item.eventId === id).length;
  const message = linkedCount > 0
    ? `このイベントには参加予定が ${linkedCount} 件あります。\nイベントを削除すると参加予定・支払い側でイベント不明になります。\n削除しますか？\n${target.eventTitle}`
    : `削除しますか？\n${target.eventTitle}`;

  const ok = confirm(message);
  if (!ok) return;

  events = events.filter((event) => event.id !== id);
  saveEvents();
  renderEvents();
  renderParticipations();
  renderPayments();
  populateGoodsEventSelect();
  renderGoods();
  populateTravelEventSelect();
  renderTravels();
  populateReviewEventSelect();
  populateReviewParticipationSelect();
  renderReviews();
  renderMcyPreview();
  renderReminders();

  if (editingId === id) {
    resetForm();
  }
}

function deleteParticipation(id) {
  const target = participations.find((participation) => participation.id === id);
  if (!target) return;

  const event = getEventById(target.eventId);
  const eventTitle = event?.eventTitle || "イベント不明";
  const linkedPaymentCount = payments.filter((payment) => payment.participationId === id).length;

  const message = linkedPaymentCount > 0
    ? `この参加予定には支払い情報が ${linkedPaymentCount} 件あります。\n参加予定を削除すると支払い側で参加IDだけが残ります。\n削除しますか？\n${eventTitle}`
    : `参加予定を削除しますか？\n${eventTitle}`;

  const ok = confirm(message);
  if (!ok) return;

  participations = participations.filter((participation) => participation.id !== id);
  saveParticipations();
  renderParticipations();
  renderPayments();
  populateReviewParticipationSelect();
  renderReviews();
  renderReminders();

  if (editingParticipationId === id) {
    resetParticipationForm();
  }
}

function deletePayment(id) {
  const target = payments.find((payment) => payment.id === id);
  if (!target) return;

  const event = getEventByParticipationId(target.participationId);
  const eventTitle = event?.eventTitle || "イベント不明";

  const ok = confirm(`支払い情報を削除しますか？\n${eventTitle}`);
  if (!ok) return;

  payments = payments.filter((payment) => payment.id !== id);
  savePayments();
  renderPayments();
  renderMcyPreview();
  renderReminders();

  if (editingPaymentId === id) {
    resetPaymentForm();
  }
}

function deleteGoods(id) {
  const target = goods.find((item) => item.goodsId === id);
  if (!target) return;

  const ok = confirm(`グッズ情報を削除しますか？\n${target.itemName || target.goodsId}`);
  if (!ok) return;

  goods = goods.filter((item) => item.goodsId !== id);
  saveGoods();
  renderGoods();
  renderMcyPreview();

  if (editingGoodsId === id) {
    resetGoodsForm();
  }
}

function deleteTravel(id) {
  const target = travels.find((travel) => travel.travelId === id);
  if (!target) return;

  const event = getEventById(target.eventId);
  const title = event?.eventTitle || target.hotelName || target.transportationType || target.travelId;
  const ok = confirm(`遠征情報を削除しますか？\n${title}`);
  if (!ok) return;

  travels = travels.filter((travel) => travel.travelId !== id);
  saveTravels();
  renderTravels();
  renderMcyPreview();

  if (editingTravelId === id) {
    resetTravelForm();
  }
}

function deleteReview(id) {
  const target = reviews.find((review) => review.reviewId === id);
  if (!target) return;

  const event = getEventById(target.eventId);
  const title = event?.eventTitle || target.memorableSong || target.reviewId;
  const ok = confirm(`参加履歴を削除しますか？\n${title}`);
  if (!ok) return;

  reviews = reviews.filter((review) => review.reviewId !== id);
  saveReviews();
  renderReviews();

  if (editingReviewId === id) {
    resetReviewForm();
  }
}

function getSuperHelloStorageKeys() {
  const keys = new Set(STORAGE_DEFINITIONS.map((definition) => definition.key));

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith("superHello")) {
      keys.add(key);
    }
  }

  return Array.from(keys).sort();
}

function readStorageValue(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function buildBackupData() {
  const storage = {};
  const rawStorage = {};
  getSuperHelloStorageKeys().forEach((key) => {
    storage[key] = readStorageValue(key);
    rawStorage[key] = localStorage.getItem(key);
  });

  return {
    app: APP_NAME,
    version: APP_VERSION,
    schema: "super-hello-localstorage-backup",
    exportedAt: new Date().toISOString(),
    storage,
    rawStorage,
    data: Object.fromEntries(STORAGE_DEFINITIONS.map((definition) => [definition.label, definition.getData()]))
  };
}

function exportAllBackup() {
  exportJson("super-hello-backup", buildBackupData());
}

function validateBackupData(data) {
  if (!data || typeof data !== "object") return false;
  if (data.app !== APP_NAME) return false;
  if (data.schema !== "super-hello-localstorage-backup") return false;
  if (!data.storage || typeof data.storage !== "object" || Array.isArray(data.storage)) return false;

  const keys = Object.keys(data.storage);
  if (keys.length === 0) return false;
  const hasKnownKey = STORAGE_DEFINITIONS.some((definition) => keys.includes(definition.key));
  if (!hasKnownKey) return false;

  return STORAGE_DEFINITIONS.every((definition) =>
    !keys.includes(definition.key) || Array.isArray(data.storage[definition.key])
  );
}

function restoreBackupData(data) {
  const backupKeys = Object.keys(data.storage).filter((key) => key.startsWith("superHello"));

  getSuperHelloStorageKeys().forEach((key) => {
    localStorage.removeItem(key);
  });

  backupKeys.forEach((key) => {
    const value = data.storage[key];
    const rawValue = data.rawStorage && typeof data.rawStorage[key] === "string" ? data.rawStorage[key] : null;
    localStorage.setItem(key, rawValue ?? (typeof value === "string" ? value : JSON.stringify(value)));
  });

  reloadAllData();
  resetForm();
  resetParticipationForm();
  resetPaymentForm();
  resetGoodsForm();
  resetTravelForm();
  resetReviewForm();
  renderAll();
}

function hasAnySuperHelloData() {
  return STORAGE_DEFINITIONS.some((definition) => definition.getData().length > 0) || mcyExportLogs.length > 0;
}

function loadSampleData() {
  if (hasAnySuperHelloData()) {
    const ok = confirm("既存データがあります。\nサンプルデータを追加投入しますか？\n既存データは上書きしません。");
    if (!ok) return;
  }

  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = String(now.getTime()).slice(-5);
  const eventId = `EVSAMPLE${stamp}${suffix}`;
  const participationId = `PTSAMPLE${stamp}${suffix}`;
  const paymentId = `PYSAMPLE${stamp}${suffix}`;
  const goodsId = `GDSAMPLE${stamp}${suffix}`;
  const travelId = `TRSAMPLE${stamp}${suffix}`;
  const reviewId = `RVSAMPLE${stamp}${suffix}`;

  events.push({
    id: eventId,
    eventDate: "2026-06-15",
    startTime: "18:30",
    groupName: "アンジュルム",
    eventType: "CONCERT",
    eventTitle: "SUPER HELLO v1.0 動作確認コンサート",
    venue: "日本武道館",
    prefecture: "東京",
    applicationDeadline: "2026-05-20",
    lotteryDate: "2026-05-27",
    paymentDeadline: "2026-06-03",
    status: "当選",
    sourceUrl: "",
    memo: "v1.0サンプルデータ",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  participations.push({
    id: participationId,
    eventId,
    participationStatus: "当選",
    ticketCount: "1",
    seatType: "一般席",
    ticketSource: "FC",
    companion: "",
    applicationDate: "2026-05-10",
    participationMemo: "サンプル参加予定",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  payments.push({
    id: paymentId,
    participationId,
    paymentItem: "チケット代",
    paymentStatus: "支払済",
    paymentDate: "2026-06-01",
    ticketPrice: "8800",
    ticketFee: "770",
    paymentMethod: "クレカ",
    paymentVendor: "FC",
    mcyExportStatus: "未連携",
    paymentMemo: "サンプル支払い",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  goods.push({
    goodsId,
    eventId,
    purchaseDate: "2026-06-15",
    groupName: "アンジュルム",
    memberName: "サンプルメンバー",
    itemName: "日替わり写真",
    goodsCategory: "写真",
    purchasePlace: "会場物販",
    quantity: "2",
    unitPrice: "500",
    totalAmount: "1000",
    paymentMethod: "現金",
    mcyExportStatus: "未連携",
    goodsMemo: "サンプルグッズ",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  travels.push({
    travelId,
    eventId,
    departureDate: "2026-06-15",
    returnDate: "2026-06-15",
    transportationType: "在来線",
    departurePlace: "自宅最寄り",
    arrivalPlace: "九段下",
    transportationCost: "1200",
    hotelName: "",
    checkInDate: "",
    checkOutDate: "",
    hotelCost: "",
    otherTravelCost: "300",
    totalTravelCost: "1500",
    paymentDate: "2026-06-15",
    paymentMethod: "電子マネー",
    bookingStatus: "利用済",
    mcyExportStatus: "未連携",
    travelMemo: "サンプル遠征",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  reviews.push({
    reviewId,
    eventId,
    participationId,
    reviewDate: "2026-06-15",
    groupName: "アンジュルム",
    venue: "日本武道館",
    seatInfo: "1階南スタンド",
    referenceNumber: "",
    satisfaction: "5",
    setlistMemo: "サンプルセットリスト",
    memorableSong: "大器晩成",
    favoriteMemberMemo: "推しメモ確認用",
    highlightMemo: "v1.0動作確認",
    reflectionMemo: "",
    reviewMemo: "参加履歴サンプルです。",
    reviewTags: "サンプル, 動作確認",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  saveEvents();
  saveParticipations();
  savePayments();
  saveGoods();
  saveTravels();
  saveReviews();
  renderAll();
  alert("サンプルデータを投入しました。");
}

function clearAllSuperHelloData() {
  if (!hasAnySuperHelloData()) {
    alert("削除対象のSUPER HELLOデータはありません。");
    return;
  }

  const firstOk = confirm("SUPER HELLOの全データを削除します。\nイベント候補、参加予定、支払い、MCY連携ログ、グッズ、遠征、参加履歴が対象です。\nこの操作は元に戻せません。続行しますか？");
  if (!firstOk) return;

  const typed = prompt("最終確認です。削除する場合は DELETE と入力してください。");
  if (typed !== "DELETE") {
    alert("入力が一致しないため削除を中止しました。");
    return;
  }

  getSuperHelloStorageKeys().forEach((key) => {
    localStorage.removeItem(key);
  });

  reloadAllData();
  resetForm();
  resetParticipationForm();
  resetPaymentForm();
  resetGoodsForm();
  resetTravelForm();
  resetReviewForm();
  renderAll();
  alert("SUPER HELLO全データを削除しました。");
}

function exportJson(filenamePrefix, data) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}-${today}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function getMcyExportPayments() {
  const target = mcyExportTarget.value;

  return payments
    .map((payment) => {
      const participation = getParticipationById(payment.participationId);
      const event = participation ? getEventById(participation.eventId) : null;
      return { ...payment, participation, event };
    })
    .filter((payment) => {
      if (payment.mcyExportStatus === "対象外") return false;

      if (target === "unexported-paid") {
        return payment.mcyExportStatus === "未連携" && payment.paymentStatus === "支払済";
      }

      if (target === "unexported-all") {
        return payment.mcyExportStatus === "未連携";
      }

      if (target === "all-paid") {
        return payment.paymentStatus === "支払済";
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a.paymentDate || a.event?.eventDate || "9999-12-31";
      const dateB = b.paymentDate || b.event?.eventDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getMcyExportGoods() {
  const target = mcyExportTarget.value;

  return goods
    .map((item) => {
      const event = getEventById(item.eventId);
      return { ...item, event };
    })
    .filter((item) => {
      if (item.mcyExportStatus === "対象外") return false;
      if (!getGoodsTotal(item)) return false;

      if (target === "unexported-paid" || target === "unexported-all") {
        return item.mcyExportStatus === "未連携";
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a.purchaseDate || "9999-12-31";
      const dateB = b.purchaseDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function getMcyExportTravels() {
  const target = mcyExportTarget.value;

  return travels
    .map((travel) => {
      const event = getEventById(travel.eventId);
      return { ...travel, event };
    })
    .filter((travel) => {
      if (travel.mcyExportStatus === "対象外") return false;
      if (!getTravelTotal(travel)) return false;

      if (target === "unexported-paid" || target === "unexported-all") {
        return travel.mcyExportStatus === "未連携";
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a.paymentDate || a.departureDate || "9999-12-31";
      const dateB = b.paymentDate || b.departureDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
}

function buildMcyPaymentRows() {
  return getMcyExportPayments().map((payment) => {
    const event = payment.event;
    const total = getPaymentTotal(payment);

    const eventDateText = event?.eventDate ? `公演日:${event.eventDate}` : "";
    const venueText = event?.venue ? `会場:${event.venue}` : "";
    const groupText = event?.groupName ? `グループ:${event.groupName}` : "";
    const memoParts = [eventDateText, venueText, groupText, payment.paymentMemo].filter(Boolean);

    return {
      date: payment.paymentDate || "",
      majorCategory: "趣味",
      middleCategory: "コンサート",
      description: buildMcyDescription(payment, event),
      amount: total,
      paymentMethod: payment.paymentMethod || "",
      source: "SUPER HELLO",
      sourceId: payment.id,
      note: memoParts.join(" / ")
    };
  });
}

function buildMcyGoodsRows() {
  return getMcyExportGoods().map((item) => {
    const event = item.event;
    const eventText = event?.eventTitle ? `関連イベント:${event.eventTitle}` : "";
    const eventDateText = event?.eventDate ? `公演日:${event.eventDate}` : "";
    const placeText = item.purchasePlace ? `購入場所:${item.purchasePlace}` : "";
    const categoryText = item.goodsCategory ? `カテゴリ:${item.goodsCategory}` : "";
    const memoParts = [placeText, categoryText, eventText, eventDateText, item.goodsMemo].filter(Boolean);

    return {
      date: item.purchaseDate || "",
      majorCategory: "趣味",
      middleCategory: "グッズ",
      description: buildMcyGoodsDescription(item),
      amount: getGoodsTotal(item),
      paymentMethod: item.paymentMethod || "",
      source: "SUPER HELLO",
      sourceId: item.goodsId,
      note: memoParts.join(" / ")
    };
  });
}

function buildMcyTravelRows() {
  return getMcyExportTravels().map((travel) => {
    const event = travel.event;
    const eventText = event?.eventTitle ? `関連イベント:${event.eventTitle}` : "";
    const eventDateText = event?.eventDate ? `公演日:${event.eventDate}` : "";
    const venueText = event?.venue ? `会場:${event.venue}` : "";
    const departureText = travel.departureDate ? `出発日:${travel.departureDate}` : "";
    const returnText = travel.returnDate ? `帰宅日:${travel.returnDate}` : "";
    const routeText = [travel.departurePlace, travel.arrivalPlace].filter(Boolean).join("->");
    const routeMemo = routeText ? `区間:${routeText}` : "";
    const transportationText = travel.transportationType ? `交通手段:${travel.transportationType}` : "";
    const hotelText = travel.hotelName ? `宿泊先:${travel.hotelName}` : "";
    const memoParts = [
      departureText,
      returnText,
      transportationText,
      routeMemo,
      hotelText,
      eventText,
      eventDateText,
      venueText,
      travel.travelMemo
    ].filter(Boolean);

    return {
      date: travel.paymentDate || travel.departureDate || "",
      majorCategory: "趣味",
      middleCategory: getMcyTravelMiddleCategory(travel),
      description: buildMcyTravelDescription(travel, event),
      amount: getTravelTotal(travel),
      paymentMethod: travel.paymentMethod || "",
      source: "SUPER HELLO",
      sourceId: travel.travelId,
      note: memoParts.join(" / ")
    };
  });
}

function buildMcyRows() {
  return [...buildMcyPaymentRows(), ...buildMcyGoodsRows(), ...buildMcyTravelRows()].sort((a, b) => {
    const dateCompare = (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31");
    if (dateCompare !== 0) return dateCompare;
    return String(a.sourceId).localeCompare(String(b.sourceId));
  });
}

function buildMcyDescription(payment, event) {
  const group = event?.groupName || "";
  const title = event?.eventTitle || "イベント不明";
  const item = payment.paymentItem || "チケット代";

  return [group, title, item].filter(Boolean).join(" ");
}

function buildMcyGoodsDescription(item) {
  return [item.groupName, item.memberName, item.itemName, "グッズ代"].filter(Boolean).join(" ");
}

function getMcyTravelMiddleCategory(travel) {
  const hasTransportation = toSafeNumber(travel.transportationCost) > 0;
  const hasHotel = toSafeNumber(travel.hotelCost) > 0;
  const hasOther = toSafeNumber(travel.otherTravelCost) > 0;

  if (hasTransportation && !hasHotel && !hasOther) return "交通費";
  if (hasHotel && !hasTransportation && !hasOther) return "宿泊費";
  return "遠征費";
}

function buildMcyTravelDescription(travel, event) {
  const eventTitle = event?.eventTitle || "イベント未紐付け";
  const travelName = [travel.transportationType, travel.hotelName].filter(Boolean).join(" / ");
  return [eventTitle, travelName, "遠征費"].filter(Boolean).join(" ");
}

function renderMcyPreview() {
  const rows = buildMcyRows();

  mcyPreviewTableBody.innerHTML = "";

  if (rows.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9">MCY出力対象はありません。</td>`;
    mcyPreviewTableBody.appendChild(row);
  } else {
    rows.forEach((rowData) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${escapeHtml(rowData.date)}</td>
        <td>${escapeHtml(rowData.majorCategory)}</td>
        <td>${escapeHtml(rowData.middleCategory)}</td>
        <td>${escapeHtml(rowData.description)}</td>
        <td class="money">${yen(rowData.amount)}</td>
        <td>${escapeHtml(rowData.paymentMethod)}</td>
        <td>${escapeHtml(rowData.source)}</td>
        <td>${escapeHtml(rowData.sourceId)}</td>
        <td>${escapeHtml(rowData.note)}</td>
      `;

      mcyPreviewTableBody.appendChild(row);
    });
  }

  const total = rows.reduce((sum, row) => sum + toSafeNumber(row.amount), 0);
  mcyPreviewCount.textContent = String(rows.length);
  mcyPreviewTotal.textContent = yen(total);
}

function exportMcyJson() {
  const rows = buildMcyRows();

  if (rows.length === 0) {
    alert("MCY出力対象がありません。");
    return;
  }

  exportJson("super-hello-mcy-export", rows);
  recordMcyExportLog("json", rows);
}

function exportMcyCsv() {
  const rows = buildMcyRows();

  if (rows.length === 0) {
    alert("MCY出力対象がありません。");
    return;
  }

  const headers = [
    "日付",
    "大項目",
    "中項目",
    "内容",
    "金額",
    "支払方法",
    "連携元",
    "参照ID",
    "備考"
  ];

  const csvRows = rows.map((row) => [
    row.date,
    row.majorCategory,
    row.middleCategory,
    row.description,
    row.amount,
    row.paymentMethod,
    row.source,
    row.sourceId,
    row.note
  ]);

  const csvText = [headers, ...csvRows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const a = document.createElement("a");
  a.href = url;
  a.download = `super-hello-mcy-export-${today}.csv`;
  a.click();

  URL.revokeObjectURL(url);
  recordMcyExportLog("csv", rows);
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function recordMcyExportLog(format, rows) {
  mcyExportLogs.push({
    id: generateId("MX"),
    format,
    exportedAt: new Date().toISOString(),
    count: rows.length,
    total: rows.reduce((sum, row) => sum + toSafeNumber(row.amount), 0),
    sourceIds: rows.map((row) => row.sourceId)
  });

  saveMcyExportLogs();
}

function markDisplayedMcyRowsAsExported() {
  const targetPayments = getMcyExportPayments();
  const targetGoods = getMcyExportGoods();
  const targetTravels = getMcyExportTravels();
  const targetCount = targetPayments.length + targetGoods.length + targetTravels.length;

  if (targetCount === 0) {
    alert("連携済にする対象がありません。");
    return;
  }

  const ok = confirm(`表示中の ${targetCount} 件を「連携済」に更新します。\nよろしいですか？`);
  if (!ok) return;

  const targetIds = new Set(targetPayments.map((payment) => payment.id));
  const targetGoodsIds = new Set(targetGoods.map((item) => item.goodsId));
  const targetTravelIds = new Set(targetTravels.map((travel) => travel.travelId));

  payments = payments.map((payment) => {
    if (!targetIds.has(payment.id)) return payment;

    return {
      ...payment,
      mcyExportStatus: "連携済",
      updatedAt: new Date().toISOString()
    };
  });

  goods = goods.map((item) => {
    if (!targetGoodsIds.has(item.goodsId)) return item;

    return {
      ...item,
      mcyExportStatus: "連携済",
      updatedAt: new Date().toISOString()
    };
  });

  travels = travels.map((travel) => {
    if (!targetTravelIds.has(travel.travelId)) return travel;

    return {
      ...travel,
      mcyExportStatus: "連携済",
      updatedAt: new Date().toISOString()
    };
  });

  savePayments();
  saveGoods();
  saveTravels();
  renderPayments();
  renderGoods();
  renderTravels();
  renderMcyPreview();

  alert("表示分を連携済に更新しました。");
}

function reloadAllData() {
  loadEvents();
  loadParticipations();
  loadPayments();
  loadMcyExportLogs();
  loadGoods();
  loadTravels();
  loadReviews();
}

function renderAll() {
  populateGoodsEventSelect();
  populateTravelEventSelect();
  populateReviewEventSelect();
  populateReviewParticipationSelect();
  renderEvents();
  renderParticipations();
  renderPayments();
  renderGoods();
  renderTravels();
  renderReviews();
  renderMcyPreview();
  renderReminders();
}

analyzeImportButton.addEventListener("click", () => {
  const text = importSourceText.value.trim();

  if (!text) {
    alert("取り込み元テキストを貼り付けてください。");
    return;
  }

  importPreviewData = parseImportedEventText(text);
  renderImportPreview(importPreviewData);
  applyImportButton.disabled = false;
});

clearImportButton.addEventListener("click", () => {
  importSourceText.value = "";
  clearImportPreview();
});

applyImportButton.addEventListener("click", () => {
  applyImportPreviewToEventForm();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getFormData();

  if (!formData.eventDate || !formData.groupName || !formData.eventType || !formData.eventTitle) {
    alert("開催日・グループ・種別・イベント名は必須です。");
    return;
  }

  upsertEvent(formData);
  resetForm();
});

participationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!editingParticipationId) {
    alert("参加予定一覧から編集対象を選択してください。");
    return;
  }

  const formData = getParticipationFormData();

  upsertParticipation(formData);
  resetParticipationForm();
});

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getReviewFormData();

  upsertReview(formData);
  resetReviewForm();
});

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!editingPaymentId) {
    alert("参加予定一覧から支払い対象を選択してください。");
    return;
  }

  const formData = getPaymentFormData();

  upsertPayment(formData);
  resetPaymentForm();
});

goodsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getGoodsFormData();

  if (!formData.purchaseDate || !formData.groupName || !formData.itemName) {
    alert("購入日・グループ・商品名は必須です。");
    return;
  }

  upsertGoods(formData);
  resetGoodsForm();
});

travelForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getTravelFormData();

  upsertTravel(formData);
  resetTravelForm();
});

resetButton.addEventListener("click", () => {
  resetForm();
});

resetParticipationButton.addEventListener("click", () => {
  resetParticipationForm();
});

resetPaymentButton.addEventListener("click", () => {
  resetPaymentForm();
});

resetGoodsButton.addEventListener("click", () => {
  resetGoodsForm();
});

resetTravelButton.addEventListener("click", () => {
  resetTravelForm();
});

resetReviewButton.addEventListener("click", () => {
  resetReviewForm();
});

newGoodsButton.addEventListener("click", () => {
  resetGoodsForm();
  scrollToGoodsForm();
});

newTravelButton.addEventListener("click", () => {
  resetTravelForm();
  scrollToTravelForm();
});

newReviewButton.addEventListener("click", () => {
  resetReviewForm();
  scrollToReviewForm();
});

searchInput.addEventListener("input", () => {
  renderEvents();
});

statusFilter.addEventListener("change", () => {
  renderEvents();
});

participationSearchInput.addEventListener("input", () => {
  renderParticipations();
});

participationStatusFilter.addEventListener("change", () => {
  renderParticipations();
});

paymentSearchInput.addEventListener("input", () => {
  renderPayments();
});

paymentStatusFilter.addEventListener("change", () => {
  renderPayments();
});

goodsSearchInput.addEventListener("input", () => {
  renderGoods();
});

goodsGroupFilter.addEventListener("change", () => {
  renderGoods();
});

goodsMcyStatusFilter.addEventListener("change", () => {
  renderGoods();
});

travelSearchInput.addEventListener("input", () => {
  renderTravels();
});

travelBookingStatusFilter.addEventListener("change", () => {
  renderTravels();
});

travelMcyStatusFilter.addEventListener("change", () => {
  renderTravels();
});

reviewSearchInput.addEventListener("input", () => {
  renderReviews();
});

reviewGroupFilter.addEventListener("change", () => {
  renderReviews();
});

reviewSatisfactionFilter.addEventListener("change", () => {
  renderReviews();
});

reviewTagSearchInput.addEventListener("input", () => {
  renderReviews();
});

document.getElementById("goodsQuantity").addEventListener("input", () => {
  syncGoodsTotalAmount();
});

document.getElementById("goodsUnitPrice").addEventListener("input", () => {
  syncGoodsTotalAmount();
});

document.getElementById("goodsEventId").addEventListener("change", () => {
  const event = getEventById(document.getElementById("goodsEventId").value);
  if (event?.groupName) {
    document.getElementById("goodsGroupName").value = event.groupName;
  }
});

document.getElementById("reviewEventId").addEventListener("change", () => {
  const event = getEventById(document.getElementById("reviewEventId").value);
  applyEventToReviewForm(event);
});

document.getElementById("reviewParticipationId").addEventListener("change", () => {
  const participation = getParticipationById(document.getElementById("reviewParticipationId").value);
  applyParticipationToReviewForm(participation);
});

["transportationCost", "hotelCost", "otherTravelCost"].forEach((elementId) => {
  document.getElementById(elementId).addEventListener("input", () => {
    syncTravelTotalAmount();
  });
});

reminderTargetFilter.addEventListener("change", () => {
  renderReminders();
});

reminderTypeFilter.addEventListener("change", () => {
  renderReminders();
});

eventTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "add-participation") {
    addParticipationFromEvent(id);
  }

  if (action === "edit") {
    const target = events.find((item) => item.id === id);
    if (target) setFormData(target);
  }

  if (action === "delete") {
    deleteEvent(id);
  }
});

participationTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "add-payment") {
    addPaymentFromParticipation(id);
  }

  if (action === "add-review") {
    addReviewFromParticipation(id);
  }

  if (action === "edit-participation") {
    const target = participations.find((item) => item.id === id);
    if (target) {
      setParticipationFormData(target);
      scrollToParticipationForm();
    }
  }

  if (action === "delete-participation") {
    deleteParticipation(id);
  }
});

paymentTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-payment") {
    const target = payments.find((item) => item.id === id);
    if (target) {
      setPaymentFormData(target);
      scrollToPaymentForm();
    }
  }

  if (action === "delete-payment") {
    deletePayment(id);
  }
});

goodsTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-goods") {
    const target = goods.find((item) => item.goodsId === id);
    if (target) {
      setGoodsFormData(target);
      scrollToGoodsForm();
    }
  }

  if (action === "delete-goods") {
    deleteGoods(id);
  }
});

travelTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-travel") {
    const target = travels.find((item) => item.travelId === id);
    if (target) {
      setTravelFormData(target);
      scrollToTravelForm();
    }
  }

  if (action === "delete-travel") {
    deleteTravel(id);
  }
});

reviewTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-review") {
    const target = reviews.find((item) => item.reviewId === id);
    if (target) {
      setReviewFormData(target);
      scrollToReviewForm();
    }
  }

  if (action === "delete-review") {
    deleteReview(id);
  }
});

reminderTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-event") {
    const target = events.find((item) => item.id === id);
    if (target) setFormData(target);
  }

  if (action === "edit-participation") {
    const target = participations.find((item) => item.id === id);
    if (target) {
      setParticipationFormData(target);
      scrollToParticipationForm();
    }
  }

  if (action === "edit-payment") {
    const target = payments.find((item) => item.id === id);
    if (target) {
      setPaymentFormData(target);
      scrollToPaymentForm();
    }
  }
});

exportJsonButton.addEventListener("click", () => {
  exportJson("super-hello-events", events);
});

exportParticipationJsonButton.addEventListener("click", () => {
  exportJson("super-hello-participations", participations);
});

exportPaymentJsonButton.addEventListener("click", () => {
  exportJson("super-hello-payments", payments);
});

exportGoodsJsonButton.addEventListener("click", () => {
  exportJson("super-hello-goods", goods);
});

exportTravelJsonButton.addEventListener("click", () => {
  exportJson("super-hello-travels", travels);
});

exportReviewJsonButton.addEventListener("click", () => {
  exportJson("super-hello-reviews", reviews);
});

mcyExportTarget.addEventListener("change", () => {
  renderMcyPreview();
});

exportMcyCsvButton.addEventListener("click", () => {
  exportMcyCsv();
});

exportMcyJsonButton.addEventListener("click", () => {
  exportMcyJson();
});

markMcyExportedButton.addEventListener("click", () => {
  markDisplayedMcyRowsAsExported();
});

exportBackupButton.addEventListener("click", () => {
  exportAllBackup();
});

restoreBackupSelectButton.addEventListener("click", () => {
  restoreBackupFile.value = "";
  restoreBackupFile.click();
});

restoreBackupFile.addEventListener("change", () => {
  const file = restoreBackupFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      if (!validateBackupData(data)) {
        alert("SUPER HELLO用バックアップJSONではありません。");
        return;
      }

      const ok = confirm("バックアップJSONから全データを復元します。\n現在のSUPER HELLO関連データは上書きされます。\n実行前に現在データのバックアップを推奨します。\n復元しますか？");
      if (!ok) return;

      restoreBackupData(data);
      alert("バックアップJSONを復元しました。");
    } catch {
      alert("JSONを読み込めませんでした。ファイル形式を確認してください。");
    }
  });
  reader.readAsText(file);
});

loadSampleDataButton.addEventListener("click", () => {
  loadSampleData();
});

clearAllDataButton.addEventListener("click", () => {
  clearAllSuperHelloData();
});

clearAllButton.addEventListener("click", () => {
  if (events.length === 0) return;

  const ok = confirm("登録済みイベントをすべて削除します。\n参加予定・支払い情報は削除されません。\nよろしいですか？");
  if (!ok) return;

  events = [];
  saveEvents();
  resetForm();
  renderEvents();
  renderParticipations();
  renderPayments();
  populateGoodsEventSelect();
  renderGoods();
  populateTravelEventSelect();
  renderTravels();
  populateReviewEventSelect();
  populateReviewParticipationSelect();
  renderReviews();
  renderMcyPreview();
  renderReminders();
});

clearParticipationButton.addEventListener("click", () => {
  if (participations.length === 0) return;

  const ok = confirm("参加予定をすべて削除します。\nイベント候補・支払い情報は削除されません。\nよろしいですか？");
  if (!ok) return;

  participations = [];
  saveParticipations();
  resetParticipationForm();
  renderParticipations();
  renderPayments();
  populateReviewParticipationSelect();
  renderReviews();
  renderMcyPreview();
  renderReminders();
});

clearPaymentButton.addEventListener("click", () => {
  if (payments.length === 0) return;

  const ok = confirm("支払い情報をすべて削除します。\nイベント候補・参加予定は削除されません。\nよろしいですか？");
  if (!ok) return;

  payments = [];
  savePayments();
  resetPaymentForm();
  renderPayments();
  renderMcyPreview();
  renderReminders();
});

clearGoodsButton.addEventListener("click", () => {
  if (goods.length === 0) return;

  const ok = confirm("グッズ情報をすべて削除します。\nイベント候補・参加予定・支払い情報は削除されません。\nよろしいですか？");
  if (!ok) return;

  goods = [];
  saveGoods();
  resetGoodsForm();
  renderGoods();
  renderMcyPreview();
});

clearTravelButton.addEventListener("click", () => {
  if (travels.length === 0) return;

  const ok = confirm("遠征情報をすべて削除します。\nイベント候補・参加予定・支払い情報・グッズ情報は削除されません。\nよろしいですか？");
  if (!ok) return;

  travels = [];
  saveTravels();
  resetTravelForm();
  renderTravels();
  renderMcyPreview();
});

clearReviewButton.addEventListener("click", () => {
  if (reviews.length === 0) return;

  const ok = confirm("参加履歴をすべて削除します。\nイベント候補・参加予定・支払い情報・グッズ情報・遠征情報は削除されません。\nよろしいですか？");
  if (!ok) return;

  reviews = [];
  saveReviews();
  resetReviewForm();
  renderReviews();
});

reloadAllData();
resetGoodsForm();
resetTravelForm();
resetReviewForm();
renderAll();
