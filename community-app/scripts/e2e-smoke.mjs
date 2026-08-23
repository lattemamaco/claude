// Dev-only smoke test that exercises the app through a real browser.
// Requires `npm run dev` running against a local dev.db. Not for use
// against a real/production database — it creates test users and content,
// and resets the seeded admin's password to a known value.
import "dotenv/config";
import { chromium } from "playwright";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const base = "http://localhost:3000";
const results = [];

function log(step, ok, extra = "") {
  results.push({ step, ok, extra });
  console.log(`${ok ? "OK " : "FAIL"} ${step}${extra ? " — " + extra : ""}`);
}

// --- Set up fixtures directly in the DB so this script is rerunnable ---
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaPg(process.env.DATABASE_URL);
const db = new PrismaClient({ adapter });

const runId = Date.now();
const adminPassword = "smoke-test-admin-password";
const memberPassword = "testpassword123";
const memberEmail = `smoke-member-${runId}@example.com`;
const secondEmail = `smoke-second-${runId}@example.com`;

let admin = await db.user.findFirst({ where: { role: "ADMIN" } });
const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
if (admin) {
  admin = await db.user.update({ where: { id: admin.id }, data: { passwordHash: adminPasswordHash } });
} else {
  admin = await db.user.create({
    data: {
      email: `smoke-admin-${runId}@example.com`,
      displayName: "SmokeAdmin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
}

const inviteCode = randomBytes(4).toString("hex");
await db.inviteCode.create({ data: { code: inviteCode, note: "smoke test", createdById: admin.id } });
await db.$disconnect();

// --- Drive the app through a real browser ---
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

try {
  // --- Signup with invite code ---
  const memberCtx = await browser.newContext();
  const page = await memberCtx.newPage();
  await page.goto(`${base}/signup`);
  await page.fill("#inviteCode", inviteCode);
  await page.fill("#displayName", "TestMember");
  await page.fill("#email", memberEmail);
  await page.fill("#password", memberPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${base}/`, { timeout: 10000 });
  log("signup -> redirects to dashboard", page.url() === `${base}/`);

  // --- Journal CRUD ---
  const entryTitle = `First entry ${runId}`;
  await page.goto(`${base}/journal/new`);
  await page.fill("#title", entryTitle);
  await page.fill("#body", "This is a private thought.");
  await page.click('main button[type="submit"]');
  await page.waitForURL(`${base}/journal`, { timeout: 10000 });
  const journalText = await page.textContent("body");
  log("journal entry created and listed", journalText.includes(entryTitle));

  await page.click(`text=${entryTitle}`);
  await page.waitForURL(/\/journal\/.+/);
  const editText = await page.textContent("body");
  log("journal entry edit page loads with content", editText.includes("This is a private thought"));

  // --- Community thread (anonymous) ---
  const threadPrompt = `What I haven't said out loud ${runId}`;
  await page.goto(`${base}/community/new`);
  await page.fill("#prompt", threadPrompt);
  await page.fill("#body", "I'm exhausted and I don't say it enough.");
  await page.check('input[name="isAnonymous"]');
  await page.click('main button[type="submit"]');
  await page.waitForURL(/\/community\/.+/, { timeout: 10000 });
  const threadArticleText = await page.locator("article").textContent();
  log(
    "anonymous thread created, shows 'Anonymous' not real name",
    threadArticleText.includes("Anonymous") && !threadArticleText.includes("TestMember")
  );

  const threadUrl = page.url();

  // reply non-anonymously
  await page.fill('textarea[name="body"]', "Replying with my name.");
  await page.click('button:has-text("Reply")');
  await page.waitForTimeout(1000);
  const repliedText = await page.textContent("body");
  log("non-anonymous reply shows display name", repliedText.includes("TestMember"));

  // member should NOT see admin nav link
  const navHasAdmin = await page.locator("nav >> text=Admin").count();
  log("member nav has no Admin link", navHasAdmin === 0);

  // member hitting /admin directly gets redirected away
  await page.goto(`${base}/admin`);
  await page.waitForURL(`${base}/`, { timeout: 5000 }).catch(() => {});
  log("member cannot access /admin", page.url() === `${base}/`);

  await memberCtx.close();

  // --- Admin flow ---
  const adminCtx = await browser.newContext();
  const apage = await adminCtx.newPage();
  await apage.goto(`${base}/login`);
  await apage.fill("#email", admin.email);
  await apage.fill("#password", adminPassword);
  await apage.click('button[type="submit"]');
  await apage.waitForURL(`${base}/`, { timeout: 10000 });
  log("admin login succeeds", apage.url() === `${base}/`);

  const navHasAdminForAdmin = await apage.locator("nav >> text=Admin").count();
  log("admin nav shows Admin link", navHasAdminForAdmin > 0);

  await apage.goto(`${base}/admin`);
  log("admin can load /admin", (await apage.textContent("body")).includes("Post this week"));

  // Post a devotional
  const devotionalTitle = `Held, even now ${runId}`;
  await apage.fill("#title", devotionalTitle);
  await apage.fill("#body", "You don't have to hold it all together today.");
  await apage.fill("#scriptureRef", "Psalm 34:18");
  await apage.fill("#scriptureText", "The Lord is close to the brokenhearted.");
  await apage.fill("#scriptureContext", "For the mom who feels like she's failing: this is for you.");
  await apage.locator('button:has-text("Publish devotional")').click();
  await apage.locator(`text=${devotionalTitle}`).first().waitFor({ timeout: 10000 });
  log("devotional published", true);

  // Generate an invite
  const inviteNote = `New friend ${runId}`;
  await apage.fill("#note", inviteNote);
  await apage.locator('button:has-text("Generate invite")').click();
  await apage.locator(`text=${inviteNote}`).first().waitFor({ timeout: 10000 });
  log("invite generated and listed", true);

  // View thread as admin — should see real name behind anonymous post
  await apage.goto(threadUrl);
  const adminThreadText = await apage.textContent("body");
  log("admin sees real name behind anonymous post", adminThreadText.includes("Anonymous (TestMember)"));

  // Schedule a live session
  await apage.goto(`${base}/admin`);
  const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const localDatetime = future.toISOString().slice(0, 16);
  await apage.fill("#scheduledAt", localDatetime);
  await apage.fill("#link", "https://zoom.us/j/123456789");
  await apage.locator('button:has-text("Schedule session")').click();
  await apage.locator("text=Monthly prayer & check-in").first().waitFor({ timeout: 10000 });
  log("live session scheduled", true);

  await adminCtx.close();

  // --- Verify devotional now shows on member dashboard ---
  const memberCtx2 = await browser.newContext();
  const p2 = await memberCtx2.newPage();
  await p2.goto(`${base}/login`);
  await p2.fill("#email", memberEmail);
  await p2.fill("#password", memberPassword);
  await p2.click('button[type="submit"]');
  await p2.waitForURL(`${base}/`, { timeout: 10000 });
  const dashboardText2 = await p2.textContent("body");
  log("member dashboard now shows published devotional", dashboardText2.includes(devotionalTitle));
  log("member dashboard shows the upcoming live session", dashboardText2.includes("Monthly prayer & check-in"));

  // --- Used invite code should be rejected ---
  await p2.goto(`${base}/signup`);
  await p2.fill("#inviteCode", inviteCode);
  await p2.fill("#displayName", "SecondUser");
  await p2.fill("#email", secondEmail);
  await p2.fill("#password", memberPassword);
  await p2.click('button[type="submit"]');
  await p2.waitForTimeout(1500);
  const reuseText = await p2.textContent("body");
  log("reused invite code is rejected", reuseText.includes("isn't valid") && p2.url().includes("/signup"));

  await memberCtx2.close();
} catch (err) {
  console.error("SMOKE TEST ERROR:", err);
  results.push({ step: "unexpected error", ok: false, extra: String(err) });
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length > 0) {
  console.log("Failed:", failed.map((f) => f.step).join(", "));
  process.exitCode = 1;
}
