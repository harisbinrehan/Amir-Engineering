// Seeds realistic-looking demo data (quotes, orders, vendors, contact
// inquiries) across the last 6 months so the admin dashboards have something
// meaningful to show in a client demo. This is fictional/placeholder data,
// not real business records — safe to re-run on a fresh `supabase db reset`.
//
// Refuses to run against anything but the local Supabase stack, so it can
// never touch production data.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2];
  }
}
loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SECRET_KEY;

if (!SUPABASE_URL || !/^https?:\/\/(127\.0\.0\.1|localhost)/.test(SUPABASE_URL)) {
  console.error(`Refusing to run: NEXT_PUBLIC_SUPABASE_URL (${SUPABASE_URL}) is not a local Supabase instance.`);
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY / SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function pickWeighted(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = rand(0, total);
  for (const [value, weight] of pairs) {
    if (r < weight) return value;
    r -= weight;
  }
  return pairs[pairs.length - 1][0];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function randomDateInLast(days) {
  return daysAgo(rand(0, days));
}

const CITIES = [
  { city: "Karachi", province: "Sindh" },
  { city: "Lahore", province: "Punjab" },
  { city: "Faisalabad", province: "Punjab" },
  { city: "Gujranwala", province: "Punjab" },
  { city: "Sialkot", province: "Punjab" },
  { city: "Multan", province: "Punjab" },
  { city: "Rawalpindi", province: "Punjab" },
  { city: "Peshawar", province: "Khyber Pakhtunkhwa" },
  { city: "Hyderabad", province: "Sindh" },
  { city: "Islamabad", province: "Islamabad Capital Territory" },
];

async function main() {
  console.log("Cleaning up old Playwright test fixtures...");
  await supabase.from("quotes").delete().ilike("full_name", "%Test User%");
  await supabase.from("quotes").delete().ilike("full_name", "Generic Entry User");
  await supabase.from("quotes").delete().ilike("full_name", "Specific Context User");
  await supabase.from("orders").delete().ilike("contact_name", "%Checkout User%");

  console.log("Clearing previously seeded demo rows (safe to re-run)...");
  await supabase.from("contact_inquiries").delete().not("id", "is", null);
  await supabase.from("quotes").delete().like("email", "%@demo-seed.test");
  await supabase.from("orders").delete().like("contact_email", "%@demo-seed.test");
  await supabase.from("vendors").delete().not("id", "is", null);

  await seedVendors();
  await seedQuotes();
  await seedOrders();
  await seedContactInquiries();

  console.log("\nDone. Row counts:");
  for (const table of ["vendors", "quotes", "quote_items", "quote_status_history", "orders", "order_items", "contact_inquiries", "expenses"]) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    console.log(`  ${table}: ${count}`);
  }
}

// ---------------------------------------------------------------------------
// Vendors (+ backfill onto the existing seeded expenses)
// ---------------------------------------------------------------------------
async function seedVendors() {
  console.log("Seeding vendors...");
  const vendors = [
    { name: "Al-Rehman Flour Mills", contact_person: "Nasir Iqbal", phone: "+92 41 2345678", email: "sales@alrehmanflour.example.com", category: "Raw Materials" },
    { name: "Punjab Agro Traders", contact_person: "Shahid Mehmood", phone: "+92 42 3567890", email: "info@punjabagro.example.com", category: "Raw Materials" },
    { name: "City Power & Gas Utilities", contact_person: "Billing Desk", phone: "+92 21 111222333", email: "billing@citypowergas.example.com", category: "Utilities" },
    { name: "Falcon Freight Logistics", contact_person: "Waqar Ahmed", phone: "+92 21 4567123", email: "dispatch@falconfreight.example.com", category: "Transport & Logistics" },
    { name: "Precision Engineering Workshop", contact_person: "Imran Sheikh", phone: "+92 42 7891234", email: "workshop@precisioneng.example.com", category: "Maintenance & Repairs" },
    { name: "SteelCraft Industrial Supplies", contact_person: "Faisal Rauf", phone: "+92 55 3214567", email: "orders@steelcraft.example.com", category: "Maintenance & Repairs" },
    { name: "Metro Stationers & Supplies", contact_person: "Adeel Anjum", phone: "+92 21 5678901", email: "sales@metrostationers.example.com", category: "Office Supplies" },
    { name: "BrightWave Marketing Agency", contact_person: "Hira Baig", phone: "+92 42 1239876", email: "hello@brightwave.example.com", category: "Marketing" },
  ];

  const { data: categories } = await supabase.from("expense_categories").select("id, name");
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]));

  const rows = vendors.map((v) => ({
    id: crypto.randomUUID(),
    name: v.name,
    contact_person: v.contact_person,
    phone: v.phone,
    email: v.email,
    notes: `Primary supplier for ${v.category.toLowerCase()}.`,
  }));
  const { error } = await supabase.from("vendors").insert(rows);
  if (error) throw error;

  const vendorsByCategory = new Map();
  vendors.forEach((v, i) => {
    const list = vendorsByCategory.get(v.category) ?? [];
    list.push(rows[i].id);
    vendorsByCategory.set(v.category, list);
  });

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, category_id, vendor_id")
    .is("vendor_id", null);

  const categoryNameById = new Map([...categoryByName].map(([name, id]) => [id, name]));
  let backfilled = 0;
  for (const expense of expenses ?? []) {
    const categoryName = categoryNameById.get(expense.category_id);
    const candidateVendors = vendorsByCategory.get(categoryName);
    if (!candidateVendors) continue; // Salaries & Wages / Miscellaneous stay vendor-less
    await supabase.from("expenses").update({ vendor_id: pick(candidateVendors) }).eq("id", expense.id);
    backfilled += 1;
  }
  console.log(`  -> ${rows.length} vendors, backfilled onto ${backfilled} expenses`);
}

// ---------------------------------------------------------------------------
// Quotes — walked through real status transitions so quote_status_history
// (and the overview pipeline chart) reflect a genuine progression.
// ---------------------------------------------------------------------------
const PIPELINE_PATHS = {
  Open: [["new"], ["new", "reviewing"], ["new", "reviewing", "contacted"], ["new", "reviewing", "contacted", "quotation_sent"], ["new", "reviewing", "contacted", "quotation_sent", "negotiation"]],
  Won: [["new", "reviewing", "contacted", "quotation_sent", "negotiation", "approved"], ["new", "reviewing", "contacted", "quotation_sent", "negotiation", "approved", "completed"]],
  Lost: [["new", "reviewing", "contacted", "rejected"], ["new", "reviewing", "contacted", "quotation_sent", "negotiation", "rejected"]],
};

const QUOTE_LEADS = [
  { fullName: "Imran Qureshi", company: null, machineryOnly: true },
  { fullName: "Ayesha Malik", company: null, machineryOnly: true },
  { fullName: "Bilal Ahmed Khan", company: "Sahara Foods Pvt Ltd", machineryOnly: false },
  { fullName: "Sana Tariq", company: null, machineryOnly: true },
  { fullName: "Usman Farooq", company: "Al-Noor Snacks & Confectionery", machineryOnly: false },
  { fullName: "Hassan Raza", company: "Metro Pasta Co.", machineryOnly: false },
  { fullName: "Nadia Chaudhry", company: "Highland Foods Processing", machineryOnly: false },
  { fullName: "Kamran Sheikh", company: "Crescent Agro Industries", machineryOnly: false },
  { fullName: "Farhan Malik", company: "Delta Food Ventures", machineryOnly: false },
  { fullName: "Mehwish Alam", company: "Zaitoon Industries", machineryOnly: false },
  { fullName: "Tariq Jameel", company: "Noor Trading Company", machineryOnly: false },
  { fullName: "Rabia Saeed", company: null, machineryOnly: true },
  { fullName: "Ahmed Bashir", company: "Golden Harvest Foods", machineryOnly: false },
  { fullName: "Zainab Hussain", company: "Prime Pack Foods", machineryOnly: false },
  { fullName: "Waleed Anwar", company: null, machineryOnly: true },
  { fullName: "Saima Yousaf", company: "Royal Noodle Factory", machineryOnly: false },
  { fullName: "Adnan Qadir", company: "Sindh Agro Processors", machineryOnly: false },
  { fullName: "Mariam Khalid", company: "Bismillah Flour & Pasta Mills", machineryOnly: false },
  { fullName: "Danish Ilyas", company: "Horizon Foods International", machineryOnly: false },
  { fullName: "Sobia Nawaz", company: null, machineryOnly: true },
  { fullName: "Haroon Siddiqui", company: "Apex Food Machinery Traders", machineryOnly: false },
  { fullName: "Fatima Zahra", company: null, machineryOnly: true },
  { fullName: "Junaid Akhtar", company: "Everfresh Foods Ltd", machineryOnly: false },
  { fullName: "Alina Yousuf", company: "Western Agro Mills", machineryOnly: false },
];

async function seedQuotes() {
  console.log("Seeding quotes...");
  const { data: machinery } = await supabase.from("machinery").select("id, capacity").eq("is_active", true);
  const { data: productionLines } = await supabase.from("production_lines").select("id").eq("is_active", true);
  const { data: staff } = await supabase.from("profiles").select("id").eq("role", "super_admin");

  let created = 0;
  for (const lead of QUOTE_LEADS) {
    const bucket = pickWeighted([["Open", 30], ["Won", 45], ["Lost", 25]]);
    const path = pick(PIPELINE_PATHS[bucket]);
    const finalStatus = path[path.length - 1];

    const createdAt = randomDateInLast(182);
    const { city } = pick(CITIES);
    const slug = lead.fullName.toLowerCase().replace(/[^a-z]+/g, ".");
    const quoteId = crypto.randomUUID();

    const { data: refData } = await supabase.rpc("generate_quote_reference");

    const useLine = !lead.machineryOnly && productionLines.length > 0 && Math.random() < 0.2;
    const machine = pick(machinery);

    const { error: quoteError } = await supabase.from("quotes").insert({
      id: quoteId,
      reference_number: refData,
      status: "new",
      full_name: lead.fullName,
      company_name: lead.company,
      email: `${slug}@demo-seed.test`,
      phone: `+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`,
      country: "Pakistan",
      city,
      message: `Interested in capacity and pricing for our ${lead.company ? "facility" : "planned setup"} in ${city}.`,
      profile_id: null,
      assigned_to: Math.random() < 0.6 ? pick(staff).id : null,
      estimated_price: ["quotation_sent", "negotiation", "approved", "completed", "rejected"].includes(finalStatus)
        ? Math.round(rand(800_000, 4_500_000) / 10_000) * 10_000
        : null,
      created_at: createdAt.toISOString(),
    });
    if (quoteError) {
      console.error("  quote insert failed:", quoteError.message);
      continue;
    }

    await supabase.from("quote_items").insert({
      quote_id: quoteId,
      machinery_id: useLine ? null : machine.id,
      production_line_id: useLine ? productionLines[0].id : null,
      quantity: randInt(1, 2),
      required_capacity: machine.capacity ?? null,
    });

    // Walk the real status transitions so the trigger populates
    // quote_status_history, then backdate those rows across the window
    // between creation and now instead of leaving them all at "now".
    for (let i = 1; i < path.length; i++) {
      await supabase.from("quotes").update({ status: path[i] }).eq("id", quoteId);
    }

    const { data: history } = await supabase
      .from("quote_status_history")
      .select("id")
      .eq("quote_id", quoteId)
      .order("changed_at", { ascending: true });

    if (history?.length) {
      const msSinceCreation = Date.now() - createdAt.getTime();
      for (let i = 0; i < history.length; i++) {
        const fraction = (i + 1) / (history.length + 1);
        const changedAt = new Date(createdAt.getTime() + msSinceCreation * fraction);
        await supabase.from("quote_status_history").update({ changed_at: changedAt.toISOString() }).eq("id", history[i].id);
      }
      const lastChangedAt = new Date(createdAt.getTime() + msSinceCreation * (history.length / (history.length + 1)));
      await supabase.from("quotes").update({ updated_at: lastChangedAt.toISOString() }).eq("id", quoteId);
    }

    created += 1;
  }
  console.log(`  -> ${created} quotes with status history`);
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
const ORDER_CONTACTS = [
  "Omar Siddiqui", "Hira Nawaz", "Asad Latif", "Mehak Fatima", "Noman Abbasi", "Saira Khan",
  "Faizan Tahir", "Aisha Rafiq", "Yasir Mahmood", "Komal Shahid", "Rizwan Ashraf", "Nida Parveen",
  "Bilawal Soomro", "Hafsa Riaz", "Danyal Aziz", "Sumbal Tariq", "Kashif Jamil", "Rukhsar Bibi",
  "Arsalan Haider", "Zoya Iftikhar", "Talha Rasheed", "Maheen Butt", "Sarfaraz Alam", "Iqra Saleem",
  "Shayan Qureshi", "Lubna Yasin", "Ovais Khalid", "Rimsha Anjum",
];

async function seedOrders() {
  console.log("Seeding orders...");
  const { data: variants } = await supabase.from("product_variants").select("id, sku, price, product:products(name)");

  let created = 0;
  for (const contactName of ORDER_CONTACTS) {
    const status = pickWeighted([
      ["delivered", 40], ["shipped", 10], ["processing", 10], ["confirmed", 10], ["pending", 15], ["cancelled", 10], ["refunded", 5],
    ]);
    const paymentMethod = pick(["cod", "bank_transfer"]);
    const paymentStatus = status === "pending" ? "unpaid" : status === "refunded" ? "refunded" : status === "cancelled" ? pick(["unpaid", "refunded"]) : "paid";

    const createdAt = randomDateInLast(182);
    const { city, province } = pick(CITIES);
    const slug = contactName.toLowerCase().replace(/[^a-z]+/g, ".");
    const orderId = crypto.randomUUID();

    const { data: numberData } = await supabase.rpc("generate_order_number");

    const lineCount = randInt(1, 3);
    const lines = Array.from({ length: lineCount }, () => {
      const variant = pick(variants);
      const quantity = randInt(1, 6);
      return { variant, quantity };
    });
    const subtotal = lines.reduce((sum, l) => sum + Number(l.variant.price) * l.quantity, 0);
    const shippingFee = subtotal > 2000 ? 0 : 200;

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: numberData,
      profile_id: null,
      status,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      contact_name: contactName,
      contact_email: `${slug}@demo-seed.test`,
      contact_phone: `+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`,
      shipping_address_line1: `House ${randInt(1, 200)}, Street ${randInt(1, 40)}`,
      shipping_city: city,
      shipping_province: province,
      shipping_postal_code: String(randInt(10000, 99999)),
      shipping_country: "Pakistan",
      tracking_number: ["shipped", "delivered"].includes(status) ? `TRK-${randInt(100000000, 999999999)}` : null,
      subtotal,
      shipping_fee: shippingFee,
      total: subtotal + shippingFee,
      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
    });
    if (orderError) {
      console.error("  order insert failed:", orderError.message);
      continue;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: orderId,
        variant_id: l.variant.id,
        product_name: l.variant.product.name,
        variant_label: l.variant.sku,
        quantity: l.quantity,
        unit_price: l.variant.price,
        line_total: Number(l.variant.price) * l.quantity,
      })),
    );
    if (itemsError) console.error("  order_items insert failed:", itemsError.message);

    created += 1;
  }
  console.log(`  -> ${created} orders`);
}

// ---------------------------------------------------------------------------
// Contact inquiries
// ---------------------------------------------------------------------------
const INQUIRIES = [
  { name: "Zeeshan Baig", subject: "Bulk pricing for noodle machinery", message: "We are setting up a new noodle production facility in Faisalabad and want bulk pricing on your automatic noodle line." },
  { name: "Mahnoor Siddiqui", subject: "Export inquiry", message: "Do you ship machinery internationally? We are based in Dubai and interested in a vermicelli line." },
  { name: "Asim Latif", subject: "Spare parts availability", message: "Looking for replacement cutting rollers for the Fresh Noodle Cutting Machine we purchased last year." },
  { name: "Hina Shaukat", subject: "Product distributorship", message: "Interested in becoming a regional distributor for Fine Foods Industries pasta products in Multan." },
  { name: "Owais Rehman", subject: "Site visit request", message: "Would like to schedule a visit to your Lahore facility to see the macaroni extrusion line in operation." },
  { name: "Saba Anwar", subject: "Catalog request", message: "Could you share your full machinery catalog with specifications and pricing?" },
  { name: "Fahad Mirza", subject: "Warranty question", message: "What is the warranty period on the Twin-Screw Food Extruder and does it cover motor replacement?" },
  { name: "Ayesha Noor", subject: "Custom capacity requirement", message: "We need a drying system rated for 800 kg/hr input — can this be custom built?" },
  { name: "Bilal Sarwar", subject: "Payment terms", message: "What payment terms do you offer for machinery orders above PKR 2 million?" },
  { name: "Komal Riaz", subject: "After-sales support", message: "Do you provide on-site installation and training for new production lines?" },
];

async function seedContactInquiries() {
  console.log("Seeding contact inquiries...");
  const rows = INQUIRIES.map((inquiry) => {
    const slug = inquiry.name.toLowerCase().replace(/[^a-z]+/g, ".");
    return {
      full_name: inquiry.name,
      email: `${slug}@demo-seed.test`,
      phone: `+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`,
      subject: inquiry.subject,
      message: inquiry.message,
      status: pickWeighted([["new", 40], ["read", 35], ["resolved", 25]]),
      created_at: randomDateInLast(90).toISOString(),
    };
  });
  const { error } = await supabase.from("contact_inquiries").insert(rows);
  if (error) throw error;
  console.log(`  -> ${rows.length} contact inquiries`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
