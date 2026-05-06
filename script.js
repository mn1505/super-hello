const STORAGE_KEY = "superHelloEventsV01";

let events = [];
let editingId = null;

const eventForm = document.getElementById("eventForm");
const eventTableBody = document.getElementById("eventTableBody");
const eventCount = document.getElementById("eventCount");
const resetButton = document.getElementById("resetButton");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const exportJsonButton = document.getElementById("exportJsonButton");
const clearAllButton = document.getElementById("clearAllButton");

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  events = raw ? JSON.parse(raw) : [];
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function generateId() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `EV${ymd}${random}`;
}

function getFormData() {
  return {
    id: editingId || generateId(),
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

  document.querySelector(".primary-button").textContent = "更新";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  eventForm.reset();
  document.getElementById("status").value = "候補";
  document.querySelector(".primary-button").textContent = "登録";
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
}

function deleteEvent(id) {
  const target = events.find((event) => event.id === id);
  if (!target) return;

  const ok = confirm(`削除しますか？\n${target.eventTitle}`);
  if (!ok) return;

  events = events.filter((event) => event.id !== id);
  saveEvents();
  renderEvents();

  if (editingId === id) {
    resetForm();
  }
}

function exportJson() {
  const data = JSON.stringify(events, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const a = document.createElement("a");
  a.href = url;
  a.download = `super-hello-events-${today}.json`;
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

resetButton.addEventListener("click", () => {
  resetForm();
});

searchInput.addEventListener("input", () => {
  renderEvents();
});

statusFilter.addEventListener("change", () => {
  renderEvents();
});

eventTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    const target = events.find((item) => item.id === id);
    if (target) setFormData(target);
  }

  if (action === "delete") {
    deleteEvent(id);
  }
});

exportJsonButton.addEventListener("click", () => {
  exportJson();
});

clearAllButton.addEventListener("click", () => {
  if (events.length === 0) return;

  const ok = confirm("登録済みイベントをすべて削除します。\nよろしいですか？");
  if (!ok) return;

  events = [];
  saveEvents();
  resetForm();
  renderEvents();
});

loadEvents();
renderEvents();