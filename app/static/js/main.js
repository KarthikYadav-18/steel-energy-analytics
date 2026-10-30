/* Steel Energy Intelligence - frontend logic (plain JavaScript, no libraries).
   It calls the Flask JSON API and draws the charts on <canvas> elements. */
const $ = (s) => document.querySelector(s);
const COLORS = { Light_Load: "#4C9F70", Medium_Load: "#E9A23B", Maximum_Load: "#D1495B" };
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmt = (n, d = 1) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: d });
const label = (s) => s.replace("_Load", "");

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} failed (${r.status})`);
  return r.json();
}

/* ---------- canvas helpers ---------- */
function setup(canvas) {
  const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = +canvas.getAttribute("height");
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h); ctx.font = "12px system-ui, sans-serif";
  return { ctx, w, h };
}
function axes(ctx, w, h, pad, maxV, ticks = 4) {
  ctx.strokeStyle = css("--line"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; ctx.textAlign = "right";
  for (let i = 0; i <= ticks; i++) {
    const y = pad.t + ((h - pad.t - pad.b) * i) / ticks;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
    ctx.fillText(fmt(maxV * (1 - i / ticks), 0), pad.l - 8, y + 4);
  }
}
function lineChart(canvas, labels, series) {
  const { ctx, w, h } = setup(canvas), pad = { l: 40, r: 12, t: 12, b: 42 };
  const maxV = Math.ceil(Math.max(...series.flatMap((s) => s.data)) / 10) * 10;
  axes(ctx, w, h, pad, maxV);
  const x = (i) => pad.l + ((w - pad.l - pad.r) * i) / (labels.length - 1);
  const y = (v) => pad.t + (h - pad.t - pad.b) * (1 - v / maxV);
  ctx.textAlign = "center"; ctx.fillStyle = css("--muted");
  labels.forEach((l, i) => { if (i % 3 === 0) ctx.fillText(l, x(i), h - 24); });
  ctx.fillText("hour of day", (w + pad.l) / 2, h - 6);
  series.forEach((s, k) => {
    ctx.strokeStyle = s.color; ctx.lineWidth = 2.5; ctx.beginPath();
    s.data.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)))); ctx.stroke();
    ctx.fillStyle = s.color; ctx.textAlign = "left";
    ctx.fillRect(pad.l + 10 + k * 110, pad.t + 4, 10, 10); ctx.fillStyle = css("--ink"); ctx.fillText(s.name, pad.l + 26 + k * 110, pad.t + 14);
  });
}
function barChart(canvas, labels, values, color) {
  const { ctx, w, h } = setup(canvas), pad = { l: 40, r: 12, t: 12, b: 28 };
  const maxV = Math.ceil(Math.max(...values) / 20) * 20;
  axes(ctx, w, h, pad, maxV);
  const bw = (w - pad.l - pad.r) / labels.length;
  values.forEach((v, i) => {
    const bh = (h - pad.t - pad.b) * (v / maxV);
    ctx.fillStyle = color; ctx.fillRect(pad.l + i * bw + bw * 0.15, h - pad.b - bh, bw * 0.7, bh);
    ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.fillText(labels[i], pad.l + i * bw + bw / 2, h - 10);
  });
}
function donut(canvas, items) {
  const { ctx, w, h } = setup(canvas), total = items.reduce((a, b) => a + b.value, 0);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10, r = R * 0.6; let a0 = -Math.PI / 2;
  items.forEach((it) => {
    const a1 = a0 + (2 * Math.PI * it.value) / total;
    ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.arc(cx, cy, r, a1, a0, true); ctx.closePath();
    ctx.fillStyle = it.color; ctx.fill(); a0 = a1;
  });
  ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.font = "700 20px system-ui";
  ctx.fillText(fmt(total, 0), cx, cy + 2); ctx.font = "12px system-ui"; ctx.fillStyle = css("--muted"); ctx.fillText("readings", cx, cy + 20);
}

/* ---------- page sections ---------- */
async function loadOverview() {
  const o = await getJSON("/api/overview");
  const k = [
    [fmt(o.rows, 0), "readings (every 15 minutes)"], [fmt(o.total_mwh, 0) + " MWh", "energy used in 2018"],
    [o.peak_hour + ":00", "busiest hour"], ["-" + o.weekend_drop + "%", "weekend usage vs weekday"],
    [fmt(o.best_r2 * 100, 2) + "%", "R2 of the best model"], [o.best_model, "best model"],
  ];
  $("#kpis").innerHTML = k.map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join("");
  return o;
}
async function loadCharts(o) {
  const c = await getJSON("/api/charts");
  const draw = () => {
    lineChart($("#cHour"), c.hours.map((h) => h + ":00"), [
      { name: "Weekday", data: c.weekday, color: css("--accent") }, { name: "Weekend", data: c.weekend, color: "#4C9F70" }]);
    barChart($("#cMonth"), c.months, c.monthly, css("--steel") || "#264653");
    donut($("#cLoad"), Object.entries(c.load_counts).map(([k, v]) => ({ value: v, color: COLORS[k] })));
  };
  draw(); window.addEventListener("resize", draw);
  $("#loadLegend").innerHTML = Object.entries(c.load_counts).map(([k, v]) =>
    `<li><i style="background:${COLORS[k]}"></i>${label(k)}: ${fmt((100 * v) / o.rows)}%</li>`).join("");
  const mid = c.weekday.slice(8, 18), dip = 8 + mid.indexOf(Math.min(...mid));
  const hi = c.months[c.monthly.indexOf(Math.max(...c.monthly))], lo = c.months[c.monthly.indexOf(Math.min(...c.monthly))];
  $("#findList").innerHTML = [
    `The plant uses most energy around <b>${o.peak_hour}:00</b>.`,
    `Weekends use <b>${o.weekend_drop}% less</b> energy than weekdays.`,
    `There is a sudden fall at <b>${dip}:00</b> on weekdays (probably the lunch break).`,
    `<b>${hi}</b> is the busiest month and <b>${lo}</b> is the quietest.`,
  ].map((t) => `<li>${t}</li>`).join("");
}
async function loadModels() {
  const m = await getJSON("/api/models");
  $("#tblReg").innerHTML = m.models.map((r) => {
    const pct = 100 * r.r2;
    return `<div class="trow ${r.model === m.best ? "best" : ""}"><span class="name">${r.model}${r.model === m.best ? '<span class="badge">best</span>' : ""}</span>
      <div class="bar-bg"><div class="bar-fg" style="width:${pct}%"></div></div><span class="num">${fmt(r.r2 * 100, 2)}%</span></div>`;
  }).join("");
  $("#gallery-grid").innerHTML = m.figures.map((f, i) =>
    `<figure><img src="/graphs/${f.file}" alt="${f.caption}" loading="lazy"><figcaption>Figure ${i + 1}: ${f.caption}</figcaption></figure>`).join("");
}

/* ---------- predictor ---------- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PRESETS = {
  night:   { lag_reactive: 3, lead_reactive: 0, lag_pf: 70, lead_pf: 100, hour: 3, month: 6, day_of_week: 1 },
  busy:    { lag_reactive: 40, lead_reactive: 0, lag_pf: 92, lead_pf: 100, hour: 10, month: 1, day_of_week: 2 },
  weekend: { lag_reactive: 4, lead_reactive: 0.5, lag_pf: 72, lead_pf: 100, hour: 14, month: 4, day_of_week: 5 },
};
function fillSelects() {
  $("#selHour").innerHTML = [...Array(24).keys()].map((h) => `<option value="${h}">${String(h).padStart(2, "0")}:00</option>`).join("");
  $("#selMonth").innerHTML = MONTHS.map((m, i) => `<option value="${i + 1}">${m}</option>`).join("");
  $("#selDay").innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}</option>`).join("");
  $("#selHour").value = 10; $("#selMonth").value = 3; $("#selDay").value = 2;
}
function render(r) {
  const sign = r.difference_pct >= 0 ? "+" : "";
  $("#result").innerHTML = `<h3>Predicted usage</h3><div class="big">${fmt(r.usage_kwh, 2)}<small>kWh in 15 minutes</small></div>
    <ul class="facts">
      <li>Normal usage in this hour: <b>${fmt(r.typical_kwh, 1)} kWh</b></li>
      <li>Difference from normal: <b>${sign}${fmt(r.difference_pct, 0)}%</b></li>
    </ul>`;
}
function wireForm() {
  const form = $("#form"), err = $("#err"), btn = form.querySelector(".go");
  document.querySelectorAll(".presets button").forEach((b) => b.addEventListener("click", () => {
    Object.entries(PRESETS[b.dataset.p]).forEach(([k, v]) => (form.elements[k].value = v)); form.requestSubmit();
  }));
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); err.textContent = ""; btn.disabled = true; btn.textContent = "Predicting...";
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch("/api/predict", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Prediction failed");
      render(data);
    } catch (ex) { err.textContent = ex.message; }
    finally { btn.disabled = false; btn.textContent = "Predict usage"; }
  });
}
(async function init() {
  fillSelects(); wireForm();
  try { const o = await loadOverview(); await loadCharts(o); await loadModels(); }
  catch (ex) { $("#kpis").innerHTML = `<div class="kpi"><b>Error</b><span>${ex.message}</span></div>`; }
})();
