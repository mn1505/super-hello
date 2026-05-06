const EVENT_STORAGE_KEY = "superHelloEventsV01";
const PARTICIPATION_STORAGE_KEY = "superHelloParticipationsV02";
const PAYMENT_STORAGE_KEY = "superHelloPaymentsV03";
const MCY_EXPORT_LOG_STORAGE_KEY = "superHelloMcyExportLogsV04";

let events = [];
let participations = [];
let payments = [];
let mcyExportLogs = [];

let editingId = null;
let editingParticipationId = null;
let editingPaymentId = null;
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

const paymentForm = document.getElementById("paymentForm");
const paymentTableBody = document.getElementById("paymentTableBody");
const paymentCount = document.getElementById("paymentCount");
const paymentTotal = document.getElementById("paymentTotal");
const paymentSearchInput = document.getElementById("paymentSearchInput");
const paymentStatusFilter = document.getElementById("paymentStatusFilter");
const exportPaymentJsonButton = document.getElementById("exportPaymentJsonButton");
const clearPaymentButton = document.getElementById("clearPaymentButton");
const resetPaymentButton = document.getElementById("resetPaymentButton");
const mcyExportTarget = document.getElementById("mcyExportTarget");
const exportMcyCsvButton = document.getElementById("exportMcyCsvButton");
const exportMcyJsonButton = document.getElementById("exportMcyJsonButton");
const markMcyExportedButton = document.getElementById("markMcyExportedButton");
const mcyPreviewTableBody = document.getElementById("mcyPreviewTableBody");
const mcyPreviewCount = document.getElementById("mcyPreviewCount");
const mcyPreviewTotal = document.getElementById("mcyPreviewTotal");

function loadEvents() {
  const raw = localStorage.getItem(EVENT_STORAGE_KEY);
  events = raw ? JSON.parse(raw) : [];
}

function saveEvents() {
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
}

function loadParticipations() {
  const raw = localStorage.getItem(PARTICIPATION_STORAGE_KEY);
  participations = raw ? JSON.parse(raw) : [];
}

function saveParticipations() {
  localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(participations));
}

function loadPayments() {
  const raw = localStorage.getItem(PAYMENT_STORAGE_KEY);
  payments = raw ? JSON.parse(raw) : [];
}

function savePayments() {
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
}

function loadMcyExportLogs() {
  const raw = localStorage.getItem(MCY_EXPORT_LOG_STORAGE_KEY);
  mcyExportLogs = raw ? JSON.parse(raw) : [];
}

function saveMcyExportLogs() {
  localStorage.setItem(MCY_EXPORT_LOG_STORAGE_KEY, JSON.stringify(mcyExportLogs));
}

function generateId(prefix) {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${ymd}${random}`;
}

function yen(value) {
  const number = Number(value || 0);
  return number.toLocaleString("ja-JP");
}

function getPaymentTotal(payment) {
  return Number(payment.ticketPrice || 0) + Number(payment.ticketFee || 0);
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

function formatDate(value) {
  if (!value) return "";
  return value;
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

function renderTitleCell(event) {
  const title = escapeHtml(event.eventTitle);
  if (!event.sourceUrl) return title;

  return `<a href="${escapeAttribute(event.sourceUrl)}" target="_blank" rel="noopener noreferrer">${title}</a>`;
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
  setPaymentFormData(payment);
  scrollToPaymentForm();

  alert(`支払い情報を作成しました。\n${event?.eventTitle || "イベント不明"}`);
}

function scrollToParticipationForm() {
  participationForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToPaymentForm() {
  paymentForm.scrollIntoView({ behavior: "smooth", block: "start" });
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

  if (editingPaymentId === id) {
    resetPaymentForm();
  }
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

function buildMcyRows() {
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

function buildMcyDescription(payment, event) {
  const group = event?.groupName || "";
  const title = event?.eventTitle || "イベント不明";
  const item = payment.paymentItem || "チケット代";

  return [group, title, item].filter(Boolean).join(" ");
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

  const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
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
    total: rows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    sourceIds: rows.map((row) => row.sourceId)
  });

  saveMcyExportLogs();
}

function markDisplayedMcyRowsAsExported() {
  const targetPayments = getMcyExportPayments();

  if (targetPayments.length === 0) {
    alert("連携済にする対象がありません。");
    return;
  }

  const ok = confirm(`表示中の ${targetPayments.length} 件を「連携済」に更新します。\nよろしいですか？`);
  if (!ok) return;

  const targetIds = new Set(targetPayments.map((payment) => payment.id));

  payments = payments.map((payment) => {
    if (!targetIds.has(payment.id)) return payment;

    return {
      ...payment,
      mcyExportStatus: "連携済",
      updatedAt: new Date().toISOString()
    };
  });

  savePayments();
  renderPayments();
  renderMcyPreview();

  alert("表示分を連携済に更新しました。");
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

resetButton.addEventListener("click", () => {
  resetForm();
});

resetParticipationButton.addEventListener("click", () => {
  resetParticipationForm();
});

resetPaymentButton.addEventListener("click", () => {
  resetPaymentForm();
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

exportJsonButton.addEventListener("click", () => {
  exportJson("super-hello-events", events);
});

exportParticipationJsonButton.addEventListener("click", () => {
  exportJson("super-hello-participations", participations);
});

exportPaymentJsonButton.addEventListener("click", () => {
  exportJson("super-hello-payments", payments);
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
});

loadEvents();
loadParticipations();
loadPayments();
loadMcyExportLogs();

renderEvents();
renderParticipations();
renderPayments();
renderMcyPreview();
