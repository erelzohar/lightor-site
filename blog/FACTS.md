# What Lightor really does - the facts articles may rely on

Checked against the code on `origin/main` of lightor-back, lightor-front,
lightor-dashboard, lightor-register and lightor-edge on **2026-10-29**
(LT-430; first version 2026-10-20), and walked through in the product itself
the same day for the guides. An article may only describe what is listed here
as live. Anything not listed: check the code first (and add it here), or leave
it out. When a feature ships or changes, update this file in the same mission.

## Building the site
- The owner tells Lighty, the AI assistant, about the business, event or idea
  in plain words (register.lightor.app), or taps a starting chip (מספרה,
  ציפורניים וקוסמטיקה, כושר ואימונים, טיפול וייעוץ, אוכל ומסעדות, אירוע).
  Lighty writes the texts, picks a design and shows the site in about a
  minute, with "what I understood" chips (kind of site, bookings or inquiries,
  language, city) that can be changed, and ten style cards to try the site on.
  It can also create the services, class places and a booking question from
  the description. No technical knowledge, no installation.
- Signing up: Google, or email with name, phone, password and the terms box;
  then a 6-digit code to the phone. The dashboard opens with a setup checklist
  (name, phone, address, hours, services, logo), Lighty's page tours, and a
  reminder to verify the email (the dashboard locks 2 days after signup until
  it is verified; the site stays live).
- Any kind of site: a business, a brochure site (אתר תדמית), a landing page, an
  event, a workshop or course, a personal project. A site either takes
  bookings (calendar plus a contact form) or collects inquiries (form only).
- Address: `<name>.lightor.app` only. **Connecting an own domain is NOT
  available** ("coming soon" in the dashboard: never promise it).
- Editing (dashboard, "עיצוב האתר"): click any text, picture or section and
  change it, by hand or with Lighty; add sections, reorder them, choose one of
  ten styles, the main colour, fonts, buttons and corners; save and publish in
  one click. AI pictures in the editor: 5 a month free, 40 on Lightor+.
- Languages: Hebrew, English, Arabic, French, Spanish, right-to-left included.
  A visitor's language switch changes the buttons and the booking flow, **not
  the owner's own texts** (they exist once, in one language).
- Currency per business: ₪, $, € or £ (chosen by the AI from the country,
  changeable in Settings). A category and sub-category per site (Settings).
- Settings also has: a popup message ("הודעה קופצת": a switch and a text;
  the site shows it in a "הודעת מערכת" box a few seconds after a visitor
  enters, with "סגור"), "הסתר את האתר שלי ממנועי חיפוש" (the site keeps
  working for anyone with the link; Google may take days to drop it), and
  the accessibility menu switch.
- On the site: who you are and what you offer, services with duration and price,
  gallery, testimonials the owner types in (no Google-reviews import), FAQ,
  WhatsApp and phone buttons, opening hours, Instagram/Facebook/X/TikTok icons,
  the address with **Google Maps and Waze link buttons (no embedded map)**.
- Accessibility: every site comes with an accessibility menu (on by default,
  the owner can switch it off) and an accessibility statement. Never say a
  site is "accessible by law" or "compliant".

## Bookings (תורים)
- Services ("סוגי שירותים"): name, optional picture, price, length in minutes
  (at least 5). A **group class** ("שיעור קבוצתי") has a number of places and
  fixed weekly times (day + hour, as many as needed); booking stops when full,
  one seat per phone per session, and a class time takes that time in the
  calendar for other services too.
- Hours ("לוח זמנים וחופשות"): per weekday on/off and start-end, breaks
  ("הוסף הפסקה"), special hours for one date ("שעות מיוחדות"), vacations with a
  title and start/end date and hour ("ניהול חופשות"). Changes to the hours
  show a save bar; a vacation saves when added. Customers see the change at
  once.
- The owner chooses how far ahead customers can book: 7 to 180 days (60 by
  default).
- Customers book on the site themselves: pick a service, then a day in a month
  calendar marked free / last places / vacation / closed-full, then a time
  (slots follow the service's length), then name, phone and the booking
  questions, then a 6-digit code to their phone. "התור נקבע בהצלחה" offers
  add-to-Google/Apple-calendar.
- Booking questions: short text, address (with Google suggestions), long note,
  multiple choice, tick-box confirmation. Each can be required and limited to
  chosen services.
- If the same phone already has a booking that day, after the code the
  customer is offered to book another or update the one they have.
- Confirmation by SMS or WhatsApp - **the customer chooses** with a switch on
  the form (SMS preselected). A failed WhatsApp is resent by SMS. Texts in
  Hebrew and English only, written by Lightor (the owner does not edit them).
  The confirmation carries the manage link and says until when it can be used,
  e.g. "לינק לניהול התור עד שעה לפני התור".
- Reminders to customers:
  - **07:00 (Israel time) on the day of the appointment**, Lightor+ and the
    free days, with the manage link. The free plan sends no reminders.
  - **About an hour before** (45-75 minutes), **Lightor+ only**, between 07:00
    and 21:45, no link. Not for a booking before noon whose morning reminder
    went out: one reminder is enough.
  - None while a Lightor+ payment has failed.
- The manage link lets the customer cancel, move the appointment, change the
  service or edit their answers. The owner sets how close to the appointment
  this is still allowed: default 1 hour, from 30 minutes up to a week. A
  booking can be moved or have its service changed **at most 3 times**; after
  that the page asks to call the business. The customer gets no text for their
  own move; a reschedule by the owner re-sends the confirmation.
- Bookings the owner makes, moves or cancels text the customer up to 40 a day
  (Lightor+ and the free days) or 10 a day (free); past that the change is
  saved and the customer is not told.
- The owner's calendar ("יומן"): week or day view and a list of upcoming
  bookings, a month picker, a filter per service ("היומנים שלי"). "תור חדש":
  service, then a day and a free time, or "שעה אחרת" (any time, even outside
  the hours; a time that overlaps a booking is refused), then name, phone and
  the booking questions. The customer gets the usual confirmation with the
  manage link. A booking's card: change time ("שינוי מועד"), the customer's
  card, call/WhatsApp, the answers, price, "סמן כהושלם", "ביטול תור". A move
  shows both times first and texts the customer "התור שלך ב-<עסק> עודכן
  ל..."; a cancel asks first and texts "...בוטל על ידי העסק. לקביעת מועד
  חדש: <site>".
- Dragging a booking in the week view to another day or time (checked
  2026-10-30) opens "להעביר את התור?" with the customer, the service, the
  current and the new time and "הלקוח יקבל הודעה על המועד החדש"; "העברה"
  saves ("התור הועבר") and texts the customer like a move, "ביטול" leaves it.
  Outside the opening hours it warns "שימו לב: זה מחוץ לשעות הפתיחה."
- **Not available**: online payment or deposits ("coming soon"), a waitlist,
  no-show tracking, memberships or punch cards. Blocking a customer exists (a
  blocked customer cannot book online).

## Leads (לידים / פניות)
- An inquiry form with the owner's own questions (quotes, sign-ups,
  call-backs); a booking site has a short contact form too.
- Every inquiry in one place ("לידים") with a status: new (חדש), contacted
  (נוצר קשר), closed (סגור).
- The contact form has name, phone, the owner's questions and an optional
  message. Questions (Settings, "האתר", "שאלות בטופס יצירת הקשר"): up to 8,
  at most 40 characters each, an answer type, a required switch, a preview;
  shown exactly as written, never translated. The answers show on the lead.
- The leads page: filters with counts, a badge on its menu icon for new ones,
  call and WhatsApp buttons, status buttons, delete, and "הוספה ללקוחות" (a
  new or an existing customer; then the button becomes "כרטיס לקוח"). The
  owner's email reads "ליד חדש מ-<name> דרך האתר שלך".
- Settings, "מה האתר עושה": bookings (calendar plus contact form) or leads
  (form only), and the main button's text.
- The site's main button can say what the owner wants ("להרשמה", "לקבלת
  הצעת מחיר").
- Free plan: 15 inquiries a month, then the form gives way to call and
  WhatsApp buttons until the next month. Closed while a payment has failed.

## The owner
- Dashboard (web, phone or computer): home with the setup checklist, Lighty,
  site design, calendar, customers, leads, hours and vacations, services,
  gallery, settings, account.
- Alerts (Account page): each event has its own channels - **the app**,
  **email**, and **the phone (WhatsApp, with SMS only as a fallback)**.
  Events: new booking, cancellation, change, morning summary, new inquiry.
  Defaults: app and email on, phone off. **A new booking never goes by
  phone**; the phone carries only the morning summary, inquiries, and
  cancellations or changes within the next 24 hours - and on the free plan
  only the morning summary (LT-489). If nothing reached the
  owner, the alert goes by email anyway. The first time the app connects,
  booking emails are switched off unless the owner already chose.
- Customers: list, visit history, private notes, blocking (every plan).
  Lightor+ only: customer insights (top customers) and CSV export.
  Customers enter by phone from every booking (site or owner), by hand
  ("הוספת לקוח") or from a lead. Top of the page: customers, new this month,
  returning (2 bookings or more), blocked. The card: call, WhatsApp, book,
  block; visits, cancellations, upcoming, estimated income (from the service
  prices, not payments); last, next and first visit; source; private notes
  (2,000 characters, the customer never sees them); the booking history with
  the answers. Blocking: the customer can no longer book or change on the
  site but can still cancel; the owner may also cancel their upcoming
  bookings (no text is sent) and note a private reason.
- Lighty in the dashboard answers questions from the owner's data ("מה יש לי
  היום?", "מתי אני פנוי מחר?", "סכם לי את השבוע", "יש לידים שלא טיפלתי
  בהם?", "מי הלקוחות הקבועים שלי?"). It does not book or change anything
  itself; requests to change the site open the editor.
  The percentage beside "שיחה חדשה" is the share of the month's AI quota
  already used.
- Site Lighty (Lightor+ and the free days): answers visitors' questions on the
  site ("יש לכם שאלה? אני כאן") from the site's public information. It cannot
  book. It is on automatically for those sites.
- The phone app is the dashboard with push alerts: **Android in Google Play**
  (approved 2026-10-29; check the listing is public before linking it), the
  **iPhone app is in App Store review** - do not promise an App Store
  download yet. Nothing is bought in the app.
- A private calendar link for the owner's own calendar app.
- Support: "דיווח על בעיה" in the dashboard, support@lightor.app.
- No Instagram integration: the owner shares the site link (bio, stories,
  WhatsApp status, Google business profile). The dashboard's home offers the
  link, WhatsApp sharing and a QR code.

## Found on Google and AI search
- Every site carries structured data (LocalBusiness with the services), its
  own sitemap, change notices to search engines (IndexNow: Bing and others, not
  Google), is open to AI search crawlers, and is linked from lightor.app/sites.
- Never promise a ranking or "first page on Google".

## Plans (lightor.app/pricing.html)
- Free forever: 15 bookings a month (cancelled ones and the owner's own count),
  3 services, 15 inquiries a month, 3 AI site rebuilds a month, 5 AI pictures
  a month in the site build (none from the editor), WhatsApp alerts for the
  owner's morning summary only,
  the "Built with Lightor" badge, the booking confirmation only (no reminders). At the limit
  the site shows call/WhatsApp buttons.
- Lightor+: ₪119 a month or ₪1,190 a year. **500 bookings a period included**
  (a cancelled booking and each class attendee count) - **not unlimited**.
  Past 500, bookings close until the next period, unless the owner switches on
  "automatic charge for extra bookings" (off by default): then ₪0.35 each.
  Unlimited services and inquiries, the hour-before reminder, 20 rebuilds a
  month, 40 AI pictures, insights + CSV, no badge, priority support, site
  Lighty. A failed payment keeps the site live but closes bookings, inquiries
  and reminders.
- Every new account: 60 days of Lightor+ free, no credit card, no commitment;
  the morning reminder only and a smaller AI budget (a card lifts both, it is
  then the whole of Lightor+); up to 200 bookings in each 30-day month without
  a card (500 with one). Once
  per phone, email, Google or Apple account; it starts once the phone is
  verified. Subscribing in the free days charges only at day 60.
