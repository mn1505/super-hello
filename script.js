const EVENT_STORAGE_KEY = "superHelloEventsV01";
const PARTICIPATION_STORAGE_KEY = "superHelloParticipationsV02";

let events = [];
let participations = [];
let editingId = null;
let editingParticipationId = null;

const eventForm = document.getElementById("eventForm");
const eventTableBody = document.getElementById("eventTableBody");
const eventCount = document.getElementById("eventCount");
const resetButton = document.getElementById("resetButton");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const exportJsonButton = document.getElementById("exportJsonButton");
const clearAllButton = document.getElementById("clearAllButton");

const participationForm = document.getElementById("participationForm");
const participationTableBody = document.getElementById("participationTableBody");
const participationCount = document.getElementById("participationCount");
const participationSearchInput = document.getElementById("participationSearchInput");
const participationStatusFilter = document.getElementById("participationStatusFilter");
const exportParticipationJsonButton = document.getElementById("exportParticipationJsonButton");
const clearParticipationButton = document.getElementById("clearParticipationButton");
const resetParticipationButton = document.getElementById("resetParticipationButton");

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

function generateId(prefix) {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${ymd}${random}`;
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
      ]
        .join(" ")
        .toLowerCase();

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

function getEventById(eventId) {
  return events.find((event) => event.id === eventId);
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
      ]
        .join(" ")
        .toLowerCase();

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

function scrollToParticipationForm() {
  participationForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteEvent(id) {
  const target = events.find((event) => event.id === id);
  if (!target) return;

  const linkedCount = participations.filter((item) => item.eventId === id).length;
  const message = linkedCount > 0
    ? `このイベントには参加予定が ${linkedCount} 件あります。\nイベントを削除すると参加予定側でイベント不明になります。\n削除しますか？\n${target.eventTitle}`
    : `削除しますか？\n${target.eventTitle}`;

  const ok = confirm(message);
  if (!ok) return;

  events = events.filter((event) => event.id !== id);
  saveEvents();
  renderEvents();
  renderParticipations();

  if (editingId === id) {
    resetForm();
  }
}

function deleteParticipation(id) {
  const target = participations.find((participation) => participation.id === id);
  if (!target) return;

  const event = getEventById(target.eventId);
  const eventTitle = event?.eventTitle || "イベント不明";

  const ok = confirm(`参加予定を削除しますか？\n${eventTitle}`);
  if (!ok) return;

  participations = participations.filter((participation) => participation.id !== id);
  saveParticipations();
  renderParticipations();

  if (editingParticipationId === id) {
    resetParticipationForm();
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

resetButton.addEventListener("click", () => {
  resetForm();
});

resetParticipationButton.addEventListener("click", () => {
  resetParticipationForm();
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

exportJsonButton.addEventListener("click", () => {
  exportJson("super-hello-events", events);
});

exportParticipationJsonButton.addEventListener("click", () => {
  exportJson("super-hello-participations", participations);
});

clearAllButton.addEventListener("click", () => {
  if (events.length === 0) return;

  const ok = confirm("登録済みイベントをすべて削除します。\n参加予定は削除されません。\nよろしいですか？");
  if (!ok) return;

  events = [];
  saveEvents();
  resetForm();
  renderEvents();
  renderParticipations();
});

clearParticipationButton.addEventListener("click", () => {
  if (participations.length === 0) return;

  const ok = confirm("参加予定をすべて削除します。\nイベント候補は削除されません。\nよろしいですか？");
  if (!ok) return;

  participations = [];
  saveParticipations();
  resetParticipationForm();
  renderParticipations();
});

loadEvents();
loadParticipations();
renderEvents();
renderParticipations();