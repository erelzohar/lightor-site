# What Lightor really does - the facts articles may rely on

Checked against the code on `origin/main` of lightor-back, lightor-front,
lightor-dashboard and lightor-edge on **2026-10-20** (LT-430). An article may
only describe what is listed here as live. Anything not listed: check the code
first (and add it here), or leave it out. When a feature ships or changes,
update this file in the same mission.

## Building the site
- The owner tells Lighty, the AI assistant, about the business, event or idea
  in plain words (register.lightor.app). Lighty writes the texts, picks a design
  and publishes the site. No technical knowledge, no installation.
- Any kind of site: a business, a brochure site (אתר תדמית), a landing page, an
  event, a workshop or course, a personal project. Bookings and inquiries are
  options a site can have, not what it is.
- Address: `<name>.lightor.app` only. **Connecting an own domain is NOT
  available** (shown as "coming soon" in the dashboard: never promise it).
- Editing: click any part of the site and change it, by hand or with Lighty;
  add sections, reorder them, save in one click.
- Languages: Hebrew, English, Arabic, French, Spanish, right-to-left included.
  A visitor's language switch changes the buttons and the booking flow, **not
  the owner's own texts** (they exist once, in one language).
- On the site: who you are and what you offer, services with duration and price,
  gallery, testimonials the owner types in (no Google-reviews import), FAQ,
  WhatsApp and phone buttons, opening hours, Instagram/Facebook/X/TikTok icons,
  the address with **Google Maps and Waze link buttons (no embedded map)**.

- Accessibility: every site comes with an accessibility menu (text size,
  contrast, highlighted links, readable font, spacing, stop animations; on by
  default, the owner can switch it off) and an accessibility statement. Never
  say a site is "accessible by law" or "compliant".

## Bookings (תורים)
- Customers book online themselves: pick a service and a free slot computed
  from the owner's weekly hours, breaks, vacations/days off and one-time
  changes for a specific date.
- Group classes with a number of places; booking stops when full. One seat per
  phone per session.
- Custom questions in the booking form: short text, address (with Google
  suggestions), long note, multiple choice, tick-box confirmation. Each can be
  required and limited to chosen services.
- The customer verifies their phone with a code (SMS or WhatsApp) when booking.
- Confirmation goes out at booking time by SMS or WhatsApp - **the customer
  chooses** the channel on the booking form. A failed WhatsApp is resent by SMS.
  Message texts exist in Hebrew and English only. The confirmation carries the
  manage link and says until when the appointment can be cancelled.
  The owner does not write or edit these texts (they are Lightor's).
- Reminders to customers:
  - **07:00 (Israel time) on the day of the appointment**, every plan, with a
    link to manage the appointment.
  - **About an hour before** (45-75 minutes), **Lightor+ only** (including the
    60 free days), no link.
- The manage link lets the customer cancel, reschedule or edit their answers.
  The owner sets how close to the appointment this is still allowed: default 1
  hour, from 30 minutes up to a week.
- The owner gets an alert when a customer books, cancels or changes.
- **Not available**: online payment or deposits by the customer ("coming soon"),
  a waitlist, no-show tracking. Blocking a customer exists (a blocked customer
  cannot book online).

## Leads (לידים / פניות)
- An inquiry form with the owner's own questions (quotes, sign-ups, call-backs).
- Every inquiry in one place with a status: new, contacted, closed.
- Instant alert to the owner. The site's main button can say what the owner
  wants ("להרשמה", "לקבלת הצעת מחיר").
- Free plan: 15 inquiries a month, then the form gives way to call and WhatsApp
  buttons until the next month.

## The owner
- Dashboard (web, phone or computer): the site, bookings calendar, inquiries,
  customers.
- Alerts by email, SMS or WhatsApp (the owner picks), with a switch per event:
  new booking, cancellation, change, morning summary, new lead.
- Customers: list, visit history, private notes, blocking (every plan).
  Lightor+ only: customer insights (top customers) and CSV export.
- Lighty in the dashboard answers questions from the owner's data ("מה יש לי
  מחר?", "סכם לי את השבוע", "יש פניות שלא טיפלתי בהן?"). It does not book or
  change anything itself.
- Site Lighty (Lightor+ only, 60 free days included): answers visitors'
  questions on the site from the site's public information. It cannot book.
- The iPhone app is **not public** (TestFlight only): do not mention an app
  store download.
- No Instagram integration: the owner shares the site link (bio, stories,
  WhatsApp status, Google business profile).

## Found on Google and AI search
- Every site carries structured data (LocalBusiness with the services), its
  own sitemap, change notices to search engines (IndexNow: Bing and others, not
  Google), is open to AI search crawlers, and is linked from lightor.app/sites.
- Never promise a ranking or "first page on Google".

## Plans (lightor.app/pricing.html)
- Free forever: 30 appointments a month, 3 services, 15 inquiries a month,
  3 AI site rebuilds a month, the "Built with Lightor" badge, confirmation +
  07:00 reminder.
- Lightor+: ₪119 a month or ₪1,190 a year. Unlimited appointments, services and
  inquiries, the hour-before reminder, 20 rebuilds a month, insights + CSV,
  no badge, priority support, site Lighty.
- Every new account: 60 days of Lightor+ free, no credit card, no commitment.
  Once per phone, email or Google account.
