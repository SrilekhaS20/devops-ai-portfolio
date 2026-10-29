const incidents = {
  latency: {
    title: "Checkout API — elevated 5xx and latency",
    severity: "SEV-2 · SIMULATED",
    summary: "The sample indicates elevated server errors and high p95 latency. A recent deployment or downstream dependency timeout is a plausible hypothesis, but the supplied evidence is not enough to confirm root cause.",
    evidence: ["5xx error rate: 18.4% over the last 5 minutes (synthetic metric).", "p95 latency: 4.8 seconds; baseline sample: 420 ms.", "PAYMENT_API_TIMEOUT appears in 34 of 200 sample log lines.", "No production systems or live telemetry were queried."],
    steps: ["Compare error and latency changes with the latest release timestamp.", "Inspect checkout and payment dependency health, timeout settings and retry behavior.", "Check whether impact is limited to one version, pod or availability zone.", "If customer impact is confirmed, follow the team's approved rollback or mitigation procedure.", "After recovery, record timeline, trigger, contributing factors and preventive actions."],
    confidence: "Moderate confidence in the symptom pattern; root cause unconfirmed."
  },
  crashloop: {
    title: "Kubernetes pod — CrashLoopBackOff",
    severity: "SEV-2 · SIMULATED",
    summary: "Repeated container restarts suggest the process is exiting or failing its startup path. Common causes include configuration errors, missing secrets, application exceptions, or probes that are too aggressive.",
    evidence: ["Pod restart count: 9 in 12 minutes (synthetic sample).", "Last termination: exit code 1.", "Readiness probe has not succeeded.", "The sample does not include actual cluster events or application logs."],
    steps: ["Inspect pod events and the previous container logs.", "Check recent changes to image, environment variables, ConfigMaps and secret references.", "Verify startup/readiness probe paths, ports and timing against application startup behavior.", "Compare a healthy replica or prior known-good revision if available.", "Apply changes through version control and approved deployment workflow; avoid ad-hoc production edits."],
    confidence: "Low-to-moderate confidence; more pod events and logs are needed."
  },
  disk: {
    title: "Node filesystem — disk pressure",
    severity: "SEV-2 · SIMULATED",
    summary: "A nearly full filesystem can disrupt logging, container writes and scheduling. The priority is to identify the affected mount and safely determine what consumed space before deleting anything.",
    evidence: ["Root filesystem usage: 94% (synthetic sample).", "Container log directory is growing faster than the sample baseline.", "Node reports a DiskPressure condition in the simulated event.", "No live host inspection was performed."],
    steps: ["Confirm the affected filesystem and inode usage with read-only checks such as df -h and df -i.", "Use du or approved node diagnostics to locate large directories; avoid printing secrets.", "Check log rotation, container image/cache growth and ephemeral-storage limits.", "Follow approved cleanup procedures; do not delete active application data blindly.", "Add capacity alerts and review retention/rotation settings after service stability is restored."],
    confidence: "Moderate confidence that storage pressure is present in the sample; source needs confirmation."
  }
};
const select = document.getElementById("incidentSelect");
const contextInput = document.getElementById("contextInput");
const result = document.getElementById("demoResult");
const analyzeButton = document.getElementById("analyzeButton");
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderAnalysis() {
  const item = incidents[select.value] || incidents.latency;
  const context = contextInput.value.trim();
  result.innerHTML = `
    <div class="result-block"><span class="confidence">${escapeHTML(item.confidence)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.summary)}</p></div>
    <div class="result-block"><h3>Evidence observed</h3><ul>${item.evidence.map(line => `<li>${escapeHTML(line)}</li>`).join("")}</ul></div>
    ${context ? `<div class="result-block"><h3>Additional context supplied</h3><p>${escapeHTML(context)}</p><p class="fine-print">This context is displayed as-is and is not independently validated.</p></div>` : ""}
    <div class="result-block"><h3>Recommended investigation sequence</h3><ul>${item.steps.map(line => `<li>${escapeHTML(line)}</li>`).join("")}</ul></div>
    <p class="fine-print">Demo mode: deterministic sample logic, not an LLM response. Recommendations are advisory; validate against your environment and incident procedures before taking action.</p>`;
}
analyzeButton.addEventListener("click", renderAnalysis);
document.getElementById("year").textContent = new Date().getFullYear();
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("copyEmail").addEventListener("click", async () => {
  const status = document.getElementById("copyStatus");
  try {
    await navigator.clipboard.writeText("lekhaconst.1@gmail.com");
    status.textContent = "Email copied to clipboard.";
  } catch {
    status.textContent = "Email: lekhaconst.1@gmail.com (select and copy)";
  }
});
