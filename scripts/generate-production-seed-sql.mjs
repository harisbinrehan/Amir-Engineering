// Generates plain SQL (no service-role key needed) that seeds the same
// fictional demo dataset as seed-demo-data.mjs, for running against
// production via `supabase db query --linked --file <output>`.
//
// Catalog IDs (machinery/variants/categories/production line) are the fixed
// vanity UUIDs from supabase/seed.sql, identical on local and production —
// verified before writing this script. The one value that differs per
// environment (a staff profile id) is resolved via a subquery, not hardcoded.
import { writeFileSync } from "node:fs";

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function pickWeighted(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = rand(0, total);
  for (const [value, weight] of pairs) {
    if (r < weight) return value;
    r -= weight;
  }
  return pairs[pairs.length - 1][0];
}
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }
function randomDateInLast(days) { return daysAgo(rand(0, days)); }
function esc(s) { return s === null || s === undefined ? "null" : `'${String(s).replace(/'/g, "''")}'`; }
function uuid() { return crypto.randomUUID(); }

const STAFF_SUBQUERY = "(select id from profiles where role = 'super_admin' order by created_at limit 1)";

const statements = [];
const push = (sql) => statements.push(sql.trim());

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------
const VENDORS = [
  { name: "Al-Rehman Flour Mills", contact_person: "Nasir Iqbal", phone: "+92 41 2345678", email: "sales@alrehmanflour.example.com", category: "Raw Materials" },
  { name: "Punjab Agro Traders", contact_person: "Shahid Mehmood", phone: "+92 42 3567890", email: "info@punjabagro.example.com", category: "Raw Materials" },
  { name: "City Power & Gas Utilities", contact_person: "Billing Desk", phone: "+92 21 111222333", email: "billing@citypowergas.example.com", category: "Utilities" },
  { name: "Falcon Freight Logistics", contact_person: "Waqar Ahmed", phone: "+92 21 4567123", email: "dispatch@falconfreight.example.com", category: "Transport & Logistics" },
  { name: "Precision Engineering Workshop", contact_person: "Imran Sheikh", phone: "+92 42 7891234", email: "workshop@precisioneng.example.com", category: "Maintenance & Repairs" },
  { name: "SteelCraft Industrial Supplies", contact_person: "Faisal Rauf", phone: "+92 55 3214567", email: "orders@steelcraft.example.com", category: "Maintenance & Repairs" },
  { name: "Metro Stationers & Supplies", contact_person: "Adeel Anjum", phone: "+92 21 5678901", email: "sales@metrostationers.example.com", category: "Office Supplies" },
  { name: "BrightWave Marketing Agency", contact_person: "Hira Baig", phone: "+92 42 1239876", email: "hello@brightwave.example.com", category: "Marketing" },
];
const CATEGORY_ID = {
  "Raw Materials": "88888888-8888-8888-8888-888888888801",
  "Utilities": "88888888-8888-8888-8888-888888888802",
  "Salaries & Wages": "88888888-8888-8888-8888-888888888803",
  "Maintenance & Repairs": "88888888-8888-8888-8888-888888888804",
  "Transport & Logistics": "88888888-8888-8888-8888-888888888805",
  "Marketing": "88888888-8888-8888-8888-888888888806",
  "Office Supplies": "88888888-8888-8888-8888-888888888807",
  "Miscellaneous": "88888888-8888-8888-8888-888888888808",
};
const vendorIds = {};
push("-- Vendors");
for (const v of VENDORS) {
  const id = uuid();
  vendorIds[v.category] ??= [];
  vendorIds[v.category].push(id);
  push(`insert into vendors (id, name, contact_person, phone, email, notes) values (${esc(id)}, ${esc(v.name)}, ${esc(v.contact_person)}, ${esc(v.phone)}, ${esc(v.email)}, ${esc(`Primary supplier for ${v.category.toLowerCase()}.`)});`);
}

// ---------------------------------------------------------------------------
// Expenses — 30 rows, last 6 months, matching the local demo dataset's shape.
// ---------------------------------------------------------------------------
const DEPARTMENTS = ["Amir Engineering", "Fine Foods Industries", "Shared / General"];
const CATEGORY_NAMES = Object.keys(CATEGORY_ID);
push("\n-- Expenses");
for (let i = 0; i < 30; i++) {
  const categoryName = pick(CATEGORY_NAMES);
  const department = pick(DEPARTMENTS);
  const amount = Math.round(rand(5000, 100000) / 100) * 100;
  const date = randomDateInLast(182);
  const vendorPool = vendorIds[categoryName];
  const vendorId = vendorPool ? pick(vendorPool) : null;
  const description = `${categoryName} - ${department}`;
  push(`insert into expenses (category_id, vendor_id, description, amount, expense_date, department) values (${esc(CATEGORY_ID[categoryName])}, ${vendorId ? esc(vendorId) : "null"}, ${esc(description)}, ${amount}, ${esc(date.toISOString().slice(0, 10))}, ${esc(department)});`);
}

// ---------------------------------------------------------------------------
// Quotes — walked through real status transitions (same trigger as local),
// with quote_status_history backdated by matching on (quote_id, to_status).
// ---------------------------------------------------------------------------
const MACHINERY_IDS = [
  "22222222-2222-2222-2222-222222222201", "22222222-2222-2222-2222-222222222202",
  "22222222-2222-2222-2222-222222222203", "22222222-2222-2222-2222-222222222204",
  "22222222-2222-2222-2222-222222222205", "22222222-2222-2222-2222-222222222206",
  "22222222-2222-2222-2222-222222222207", "22222222-2222-2222-2222-222222222208",
];
const PRODUCTION_LINE_ID = "33333333-3333-3333-3333-333333333301";
const MACHINERY_CAPACITY = {
  "22222222-2222-2222-2222-222222222201": "300 – 500 kg/hr",
  "22222222-2222-2222-2222-222222222202": "150 – 250 kg/hr",
  "22222222-2222-2222-2222-222222222203": "400 – 600 kg/hr",
  "22222222-2222-2222-2222-222222222204": "250 – 400 kg/hr",
  "22222222-2222-2222-2222-222222222205": "300 – 450 kg/hr",
  "22222222-2222-2222-2222-222222222206": "350 – 700 kg/hr",
  "22222222-2222-2222-2222-222222222207": "500 kg/hr input",
  "22222222-2222-2222-2222-222222222208": "Up to 60 bags/min",
};

const CITIES = ["Karachi", "Lahore", "Faisalabad", "Gujranwala", "Sialkot", "Multan", "Rawalpindi", "Peshawar", "Hyderabad", "Islamabad"];

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

push("\n-- Quotes");
for (const lead of QUOTE_LEADS) {
  const bucket = pickWeighted([["Open", 30], ["Won", 45], ["Lost", 25]]);
  const path = pick(PIPELINE_PATHS[bucket]);
  const finalStatus = path[path.length - 1];
  const createdAt = randomDateInLast(182);
  const city = pick(CITIES);
  const slug = lead.fullName.toLowerCase().replace(/[^a-z]+/g, ".");
  const quoteId = uuid();
  const useLine = !lead.machineryOnly && Math.random() < 0.2;
  const machineId = pick(MACHINERY_IDS);
  const estimatedPrice = ["quotation_sent", "negotiation", "approved", "completed", "rejected"].includes(finalStatus)
    ? Math.round(rand(800000, 4500000) / 10000) * 10000
    : null;
  const assignTo = Math.random() < 0.6 ? STAFF_SUBQUERY : "null";

  push(`insert into quotes (id, reference_number, status, full_name, company_name, email, phone, country, city, message, profile_id, assigned_to, estimated_price, created_at) values (${esc(quoteId)}, (select generate_quote_reference()), 'new', ${esc(lead.fullName)}, ${esc(lead.company)}, ${esc(`${slug}@demo-seed.test`)}, ${esc(`+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`)}, 'Pakistan', ${esc(city)}, ${esc(`Interested in capacity and pricing for our ${lead.company ? "facility" : "planned setup"} in ${city}.`)}, null, ${assignTo}, ${estimatedPrice ?? "null"}, ${esc(createdAt.toISOString())});`);

  push(`insert into quote_items (quote_id, machinery_id, production_line_id, quantity, required_capacity) values (${esc(quoteId)}, ${useLine ? "null" : esc(machineId)}, ${useLine ? esc(PRODUCTION_LINE_ID) : "null"}, ${randInt(1, 2)}, ${useLine ? "null" : esc(MACHINERY_CAPACITY[machineId])});`);

  for (let i = 1; i < path.length; i++) {
    push(`update quotes set status = ${esc(path[i])} where id = ${esc(quoteId)};`);
  }

  if (path.length > 1) {
    const msSinceCreation = Date.now() - createdAt.getTime();
    for (let i = 1; i < path.length; i++) {
      const fraction = i / path.length;
      const changedAt = new Date(createdAt.getTime() + msSinceCreation * fraction);
      push(`update quote_status_history set changed_at = ${esc(changedAt.toISOString())} where quote_id = ${esc(quoteId)} and to_status = ${esc(path[i])};`);
    }
    const lastChangedAt = new Date(createdAt.getTime() + msSinceCreation * ((path.length - 1) / path.length));
    push(`update quotes set updated_at = ${esc(lastChangedAt.toISOString())} where id = ${esc(quoteId)};`);
  }
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
const VARIANTS = [
  { id: "77777777-7777-7777-7777-777777770101", sku: "FF-CN-400", price: 150, name: "Chicken Noodles" },
  { id: "77777777-7777-7777-7777-777777770102", sku: "FF-CN-1KG", price: 340, name: "Chicken Noodles" },
  { id: "77777777-7777-7777-7777-777777770201", sku: "FF-MN-400", price: 150, name: "Masala Noodles" },
  { id: "77777777-7777-7777-7777-777777770202", sku: "FF-MN-1KG", price: 340, name: "Masala Noodles" },
  { id: "77777777-7777-7777-7777-777777770301", sku: "FF-EM-400", price: 140, name: "Classic Elbow Macaroni" },
  { id: "77777777-7777-7777-7777-777777770302", sku: "FF-EM-1KG", price: 320, name: "Classic Elbow Macaroni" },
  { id: "77777777-7777-7777-7777-777777770401", sku: "FF-FU-400", price: 160, name: "Fusilli Pasta" },
  { id: "77777777-7777-7777-7777-777777770402", sku: "FF-FU-1KG", price: 360, name: "Fusilli Pasta" },
  { id: "77777777-7777-7777-7777-777777770501", sku: "FF-PE-400", price: 160, name: "Penne Pasta" },
  { id: "77777777-7777-7777-7777-777777770502", sku: "FF-PE-1KG", price: 360, name: "Penne Pasta" },
  { id: "77777777-7777-7777-7777-777777770601", sku: "FF-VR-200", price: 90, name: "Premium Vermicelli (Seviyan)" },
  { id: "77777777-7777-7777-7777-777777770602", sku: "FF-VR-400", price: 170, name: "Premium Vermicelli (Seviyan)" },
];

const ORDER_CONTACTS = [
  "Omar Siddiqui", "Hira Nawaz", "Asad Latif", "Mehak Fatima", "Noman Abbasi", "Saira Khan",
  "Faizan Tahir", "Aisha Rafiq", "Yasir Mahmood", "Komal Shahid", "Rizwan Ashraf", "Nida Parveen",
  "Bilawal Soomro", "Hafsa Riaz", "Danyal Aziz", "Sumbal Tariq", "Kashif Jamil", "Rukhsar Bibi",
  "Arsalan Haider", "Zoya Iftikhar", "Talha Rasheed", "Maheen Butt", "Sarfaraz Alam", "Iqra Saleem",
  "Shayan Qureshi", "Lubna Yasin", "Ovais Khalid", "Rimsha Anjum",
];
const PROVINCES = { Karachi: "Sindh", Lahore: "Punjab", Faisalabad: "Punjab", Gujranwala: "Punjab", Sialkot: "Punjab", Multan: "Punjab", Rawalpindi: "Punjab", Peshawar: "Khyber Pakhtunkhwa", Hyderabad: "Sindh", Islamabad: "Islamabad Capital Territory" };

push("\n-- Orders");
for (const contactName of ORDER_CONTACTS) {
  const status = pickWeighted([["delivered", 40], ["shipped", 10], ["processing", 10], ["confirmed", 10], ["pending", 15], ["cancelled", 10], ["refunded", 5]]);
  const paymentMethod = pick(["cod", "bank_transfer"]);
  const paymentStatus = status === "pending" ? "unpaid" : status === "refunded" ? "refunded" : status === "cancelled" ? pick(["unpaid", "refunded"]) : "paid";
  const createdAt = randomDateInLast(182);
  const city = pick(CITIES);
  const province = PROVINCES[city];
  const slug = contactName.toLowerCase().replace(/[^a-z]+/g, ".");
  const orderId = uuid();
  const lineCount = randInt(1, 3);
  const lines = Array.from({ length: lineCount }, () => ({ variant: pick(VARIANTS), quantity: randInt(1, 6) }));
  const subtotal = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
  const shippingFee = subtotal > 2000 ? 0 : 200;
  const trackingNumber = ["shipped", "delivered"].includes(status) ? `TRK-${randInt(100000000, 999999999)}` : null;

  push(`insert into orders (id, order_number, profile_id, status, payment_method, payment_status, contact_name, contact_email, contact_phone, shipping_address_line1, shipping_city, shipping_province, shipping_postal_code, shipping_country, tracking_number, subtotal, shipping_fee, total, created_at, updated_at) values (${esc(orderId)}, (select generate_order_number()), null, ${esc(status)}, ${esc(paymentMethod)}, ${esc(paymentStatus)}, ${esc(contactName)}, ${esc(`${slug}@demo-seed.test`)}, ${esc(`+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`)}, ${esc(`House ${randInt(1, 200)}, Street ${randInt(1, 40)}`)}, ${esc(city)}, ${esc(province)}, ${esc(String(randInt(10000, 99999)))}, 'Pakistan', ${trackingNumber ? esc(trackingNumber) : "null"}, ${subtotal}, ${shippingFee}, ${subtotal + shippingFee}, ${esc(createdAt.toISOString())}, ${esc(createdAt.toISOString())});`);

  for (const l of lines) {
    push(`insert into order_items (order_id, variant_id, product_name, variant_label, quantity, unit_price, line_total) values (${esc(orderId)}, ${esc(l.variant.id)}, ${esc(l.variant.name)}, ${esc(l.variant.sku)}, ${l.quantity}, ${l.variant.price}, ${l.variant.price * l.quantity});`);
  }
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
push("\n-- Contact inquiries");
for (const inquiry of INQUIRIES) {
  const slug = inquiry.name.toLowerCase().replace(/[^a-z]+/g, ".");
  const status = pickWeighted([["new", 40], ["read", 35], ["resolved", 25]]);
  push(`insert into contact_inquiries (full_name, email, phone, subject, message, status, created_at) values (${esc(inquiry.name)}, ${esc(`${slug}@demo-seed.test`)}, ${esc(`+92 3${randInt(0, 9)}${randInt(1000000, 9999999)}`)}, ${esc(inquiry.subject)}, ${esc(inquiry.message)}, ${esc(status)}, ${esc(randomDateInLast(90).toISOString())});`);
}

const outPath = process.argv[2] ?? "/tmp/production-seed.sql";
writeFileSync(outPath, statements.join("\n") + "\n");
console.log(`Wrote ${statements.length} statements to ${outPath}`);
