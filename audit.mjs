import { chromium } from "playwright";

const BASE = "http://localhost:3105";
const browser = await chromium.launch();

const PAGES = [
  "/",
  "/about",
  "/amir-engineering",
  "/fine-foods",
  "/machinery",
  "/production-lines",
  "/products",
  "/solutions",
  "/projects",
  "/contact",
  "/quote/request",
  "/cart",
  "/checkout",
  "/track-order",
  "/login",
  "/register",
  "/machinery/automatic-noodle-production-machine",
  "/production-lines/noodle-production-line",
  "/products/chicken-noodles",
  "/projects/nonexistent-should-404",
  "/machinery/nonexistent-should-404",
  "/this-route-does-not-exist",
];

async function auditPage(path) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("requestfailed", (req) => {
    failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && res.request().resourceType() === "image") {
      failedRequests.push(`IMG ${res.status()} ${res.url()}`);
    }
  });

  let status = null;
  let title = null;
  try {
    const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load", timeout: 20000 });
    status = resp?.status() ?? null;
    title = await page.title();
    await page.waitForTimeout(400);
  } catch (e) {
    consoleErrors.push(`NAVIGATION FAILED: ${e.message}`);
  }

  await page.close();
  return { path, status, title, consoleErrors, failedRequests, pageErrors };
}

const results = [];
for (const p of PAGES) {
  results.push(await auditPage(p));
}

await browser.close();

console.log("\n=== AUDIT RESULTS ===\n");
for (const r of results) {
  const hasIssues = r.consoleErrors.length || r.failedRequests.length || r.pageErrors.length;
  console.log(`${hasIssues ? "⚠️ " : "✅"} ${r.path} — status ${r.status} — "${r.title}"`);
  if (r.consoleErrors.length) console.log("  console errors:", r.consoleErrors);
  if (r.pageErrors.length) console.log("  page errors:", r.pageErrors);
  if (r.failedRequests.length) console.log("  failed requests:", r.failedRequests);
}
