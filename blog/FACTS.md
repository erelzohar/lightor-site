# What Lightor really does - the facts articles may rely on

Checked against the code on `origin/main` of lightor-back, lightor-front,
lightor-dashboard, lightor-register and lightor-edge on **2026-10-29**
(LT-430; first version 2026-10-20), and walked through in the product itself
the same day for the guides. Products (sites that show products) checked the
same way on 2026-11-03 (LT-565), the blog on a business's site on 2026-11-08
(LT-615), an own domain for a site on 2026-11-15 (LT-661), the United States
and the customer texts' languages on 2026-11-24 (LT-715, "The United States"
below). An article may only
describe what is listed here
as live. Anything not listed: check the code first (and add it here), or leave
it out. When a feature ships or changes, update this file in the same mission.

## Building the site
- The owner tells Lighty, the AI assistant, about the business, event or idea
  in plain words (register.lightor.app), or taps a starting chip (מספרה,
  ציפורניים וקוסמטיקה, כושר ואימונים, טיפול וייעוץ, אוכל ומסעדות, אירוע).
  Lighty writes the texts, picks a design and shows the site in about a
  minute, with "what I understood" chips (the kind of business, the language
  and the address) that can be changed, and an "עיצוב מחדש" button that tries
  the site in another of the ten designs (LT-659, LT-671). Bookings,
  inquiries or products are asked of Lighty in the chat, not chosen on a chip.
  Without an account a visitor builds one site and changes it once (a chat
  edit or a chip); the "עיצוב מחדש" button has its own three tries a day
  (LT-679). Signing up is free and opens the rest (LT-664).
  It can also create the services, class places and a booking question from
  the description, and on a products site up to 5 sample products (see
  Products). No technical knowledge, no installation.
- Signing up: Google, or email with name, phone, password and the terms box;
  then a 6-digit code to the phone. The dashboard opens with a setup checklist
  (name, phone, address, hours, services, logo), Lighty's page tours, and a
  reminder to verify the email (the dashboard locks 2 days after signup until
  it is verified; the site stays live).
- A site's sections: the opening, an introduction, highlights, a gallery,
  services and prices, products, a blog (Pro), questions and answers, opening
  hours, the address, a contact form and social links. **No countdown**, no
  forum or comments, no members' area, no newsletter, no ticket sales or store
  checkout (lightor-back `aiController.ts`, the build's and the editor's
  instructions, checked 2026-11-17).
- Any kind of site: a business, a brochure site (אתר תדמית), a landing page, an
  event, a workshop or course, a personal project. A site either takes
  bookings (calendar plus a contact form) or collects inquiries (form only),
  and any site can also show products. A products site (the build's
  "אתר מוצרים") is an inquiries site whose products sit high on the page.
- Address: every site gets `<name>.lightor.app`. Lighty picks the name from
  the business name; the owner can change it at any time in Settings
  ("הלינק שלך"): 2 to 20 English letters, digits and hyphens, with a live
  availability check. The previous link stops working, and Settings warns
  about that first. On Lightor+ and Lightor Pro the owner can also connect an
  own domain (see "An own domain").
- Editing (dashboard, "עיצוב האתר"): click any text, picture or section and
  change it, by hand or with Lighty; add sections, reorder them, choose one of
  ten styles, the main colour, fonts, buttons and corners; save and publish in
  one click. AI pictures in the editor: 10 a month on Lightor+, 40 on Lightor
  Pro; the free plan's 5 are for the site build and for products made from a
  few words (LT-568).
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
  A cancelled class booking frees its place, and a session that falls inside
  a vacation is not offered (lightor-back `appointmentController.ts`, checked
  2026-11-10).
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
  chosen services. A question can be marked "להציג בהתראה על תור
  חדש": its answer then shows in the app alert for every new booking.
- If the same phone already has a booking that day, after the code the
  customer is offered to book another or update the one they have.
- Every text to the customer names the business: the confirmation ("נקבע לך
  תור ל<עסק>"), the morning and hour-before reminders, a move and a cancel
  by the owner (lightor-back `notificationService.ts`, checked 2026-11-18).
- Confirmation by SMS or WhatsApp - **the customer chooses** with a switch on
  the form (SMS preselected). A failed WhatsApp is resent by SMS. Texts in
  Hebrew and English only, written by Lightor (the owner does not edit them).
- **The customer texts' language is the owner's** (LT-715, checked 2026-11-24
  on lightor-back `notificationService.ts`: `user.defaultLanguage`, Hebrew when
  none; a language without the text falls back to English). The confirmation,
  the reminders, a move and a cancel exist in Hebrew and English only, so **an
  owner who runs Lightor in Arabic (or French or Spanish) has customers who get
  English**. The WhatsApp template is asked for in the owner's language
  (`lightor_cust_book_ar` ...); a template Meta refuses goes out as the same
  English text by SMS to an Israeli number (LT-215). **An Arabic article never
  promises Arabic texts to customers**; the dashboard, the site's buttons and
  the booking flow are in Arabic.
  The confirmation carries the manage link and says until when it can be used,
  e.g. "לינק לניהול התור עד שעה לפני התור".
- Reminders to customers:
  - **07:00 (Israel time) on the day of the appointment**, Lightor+, Lightor
    Pro and the free days, with the manage link. The free plan sends no
    reminders.
  - **About an hour before** (45-75 minutes), **Lightor Pro only** (LT-504,
    `hourlyReminder` in lightor-back `src/utils/entitlements.ts`, checked
    2026-11-08 in LT-619; Lightor+ and the free days get the morning one only),
    between 07:00 and 21:45, no link. Not for a booking before noon whose
    morning reminder went out: one reminder is enough.
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
  at most 40 characters each, an answer type (the booking questions' five:
  short text, address, long note, multiple choice of 2-10 options, tick-box
  confirmation), a required switch, a preview; shown exactly as written, never
  translated. The answers show on the lead.
- The leads page: filters with counts, a badge on its menu icon for new ones,
  call and WhatsApp buttons, status buttons, delete, and "הוספה ללקוחות" (a
  new or an existing customer; then the button becomes "כרטיס לקוח"). The
  owner's email reads "ליד חדש מ-<name> דרך האתר שלך".
- Settings, "מה האתר עושה", **shows** the site's type: bookings (calendar
  plus contact form), leads (form only) or products. It is set when the site
  is built and changes only by asking Lighty (LT-556): there is no switch for
  the owner. The main button's text is the owner's to write there ("טקסט
  הכפתור הראשי").
- The person who sends the form gets **no text or email from Lightor**: only
  the owner is told. A form has **no number of places**: it closes only at the
  plan's monthly limit (lightor-back `messagingController.ts`,
  `sendContactMessage`/`announceLead`, checked 2026-11-17). Places exist only
  in a group class (see Bookings).
- An inquiry about a product carries the product: the lead names it and
  links to its page.
- The site's main button can say what the owner wants ("להרשמה", "לקבלת
  הצעת מחיר").
- Free plan: 15 inquiries a month, Lightor+ 200 (the free days too), Lightor
  Pro unlimited. At the limit the form gives way to call and WhatsApp buttons
  until the next month. Closed while a payment has failed.

## Products (מוצרים)
- Any site can show products (the dashboard's "מוצרים" page). A product has a
  name, a short summary, a description, a category, a price (optional: with
  none, no price is shown), up to 6 pictures and short details (bullet
  points); it is shown or a draft, and can be marked sold out ("אזל
  מהמלאי"). The owner drags them into order.
- Colours and sizes (LT-587/588, 2026-11-05): on the product's form the owner
  adds colours ("צבעים": a name and a swatch, up to 12) and sizes ("מידות":
  short words, up to 16). The product page shows them to pick; the visitor's
  pick goes with the "מעוניין/ת" inquiry (the lead shows it beside the
  product's name) and into the ready WhatsApp message. A pick is not an order,
  and there is no stock count per colour or size (lightor-dashboard
  `ProductOptionsField.tsx`, lightor-front `ProductParts.tsx` `ProductOptions`,
  lightor-back `messagingController.ts` `pickedOptions`, checked 2026-11-23).
- Adding them: one by one, "כמה תמונות בבת אחת" (a draft product for each
  picture), "לייטי ימלא מהתמונה" (Lighty writes the name, summary,
  description and category from the first picture - never the price), and a
  gallery can become products in one step ("להפוך למוצרים"). Since LT-564
  the dashboard's Lighty can add and change them too, on a card.
- From a few words (LT-568): a new product's form has "כמה מילים על המוצר"
  and "Lighty ייצור את המוצר": Lighty writes the name, summary, full
  description and category from the owner's words (never a material, size,
  brand, origin or price they did not write), and, when the product has no
  picture yet, makes one with AI. That picture is one of the plan's monthly AI
  pictures (the free plan 5, Lightor+ and the free days 10, Lightor Pro 40);
  once the month's are used, Lighty writes the texts and the owner adds a
  picture. Everything stays editable until the owner saves.
- From pictures in Lighty's chat (LT-568): the owner attaches up to 6
  pictures to a message and asks for a product; Lighty proposes it on a card
  with the pictures, its texts from what they show, and the product is made
  when the owner confirms (a draft unless they said to show it).
- "הצג מוצרים באתר" on the Products page hides or shows them all at once;
  hidden products stay stored.
- On the site: a products section on the home page (each style has its own
  layouts; the editor designs the card, the products page and the product
  page). With two products or more, "/products" lists them all with category
  chips, and each product has its own page: pictures, price, category,
  description, details, a "מעוניין/ת" button that opens the contact form
  with the product, "בוואטסאפ" beside it (with a ready message naming the
  product), a share button and "עוד מוצרים" (the same category first).
- Google: each product page has its own title, description and structured
  data (a Product, with its price when it has one), and is in the site's
  sitemap.
- On a products site the dashboard's menu has "מוצרים" in its first section
  ("ראשי"), and "סוגי שירותים" only when there are services.
- Plans: free 5 products (with their pages), Lightor+ 15 (the free days too),
  Lightor Pro 100. Past the plan's number the rest are kept and hidden: the
  site shows the first ones in the owner's order, and an upgrade shows the
  rest again. On the free plan adding stops at 5.
- The build makes up to 5 sample products for a products site. They show on
  the site like any other and are marked "דוגמה, כדאי להחליף" in the
  dashboard until the owner edits them.
- **Not available**: buying on the site (no cart, checkout or online
  payment), orders, delivery, coupons, stock counts,
  importing from Instagram or a file, a Google Shopping feed, product
  reviews. An inquiry or a WhatsApp tap is a message to the owner, never an
  order. The home page says "חנות שלמה בכמה שניות" (a store that shows the
  products); never promise buying or payment on the site.
- The Products page is in the web dashboard; the phone apps get it with their
  next version, so do not promise it in the apps yet.

## The blog on the business's site (בלוג)
- **Lightor Pro only.** Not in the free plan, Lightor+ or the 60 free days
  (which are Lightor+). On those the dashboard menu shows "בלוג" locked, and
  the site has no blog.
- The dashboard's "בלוג" page: the owner writes a post ("אני כותב") or asks
  Lighty ("Lighty כותב"). A post is made of blocks: headings, paragraphs,
  lists, a quote and pictures with a caption; no rich-text editor. It is
  previewed in the site's own look before publishing.
- Lighty proposes topics from the business, its services or products and the
  season, or the owner writes a topic ("נושא שחשבת עליו") and may add their
  own words. Lighty writes a draft from what the site says and the owner's
  words: a title, a line for Google and the body (500-900 words). Prices or
  numbers about the business that the site and the owner did not give are
  taken out; a health or therapy business's post ends with a line that it is
  not personal advice. A draft takes up to a minute. **10 Lighty drafts a
  month** on Pro; a failed one is not counted.
- Every Lighty draft gets a main picture and two pictures inside. Lighty first
  looks at the site's own pictures and uses one only when it really shows that
  part of the post; where none fits it makes one with AI, from the plan's 40
  AI pictures a month.
- **Nothing is published on its own**: the owner reads, corrects and
  publishes. Posts the owner writes are unlimited; up to 30 first
  publications a month (an anti-spam ceiling).
- A post's address (/blog/<address>, Latin letters) follows its title until
  the first publication and is fixed from then on, so shared links keep
  working. After publishing, the editor shows the address with "שיתוף
  בוואטסאפ", and "הורדה מהאתר" takes a post off the site.
- On the site: a blog page (/blog), a page for each post (/blog/<address>)
  and a "latest posts" section on the home page. In the site editor: three
  looks for the blog page, three for the home section, two for the post page.
- Google: each post has its own title, description and sharing picture,
  structured data (a blog post), and is in the site's sitemap.
- Moving off Pro hides the posts and never deletes them; they show again with
  Pro.
- **Not available**: comments, scheduled publishing, an email newsletter,
  importing posts from another blog, several authors. Lighty never
  publishes a post by itself.

## An own domain (דומיין משלך)
- **Lightor+ and Lightor Pro only** (LT-661, live 2026-11-15), the 60 free
  days included (they are Lightor+). **Not on the free plan.**
- **The owner buys the domain** at any registrar and renews it there. Lightor
  does not sell, register or renew domains.
- Connecting (dashboard, Settings, the "האתר" tab, the own-domain card): the
  owner types the domain, adds **one record** at the registrar (a CNAME for
  `www` pointing to `sites.lightor.app`), and forwards the bare domain
  (without www) to the `www` address, also at the registrar.
- The security certificate (HTTPS) is issued and renewed automatically.
  Usually minutes, sometimes a few hours: never promise "at once".
- The site lives at `www.<domain>`. The `<name>.lightor.app` address keeps
  working and forwards to the domain.
- **One domain per site.** Booking-management links in text messages stay on
  the lightor.app address.
- While connecting, the card shows the record to add with copy buttons, checks
  again by itself every few seconds ("בדיקה עכשיו" checks at once), and names
  a date: a domain not connected by then (3 days) is released and can be
  connected again.
- Once connected, the dashboard's own links carry the domain: the note under
  "הלינק שלך" (Settings, "כללי"), the share buttons and the QR code.
- **Disconnecting** is a button on the same card, on any plan: the site stops
  answering on the domain and stays on its lightor.app address. The domain can
  be connected again.
- No extra charge for the connection itself; the domain's own price is
  between the owner and the registrar.
- Down to the free plan: the domain is **paused, not deleted**, and the site
  goes back to its lightor.app address. Upgrading again brings it back; after
  30 paused days it has to be connected again.
- **Not available**: buying a domain through Lightor, mailboxes on the domain
  (mail that already runs on the domain is not touched), more than one domain
  for a site, a domain on the free plan.

## The owner
- Dashboard (web, phone or computer): home with the setup checklist, Lighty,
  site design, calendar, customers, leads, hours and vacations, services,
  products, gallery, settings, account.
- Alerts (Account page): each event has its own channels - **the app**,
  **email**, and **the phone (WhatsApp, with SMS only as a fallback)**.
  Events: new booking, cancellation, change, morning summary, new inquiry.
  Defaults: app and email on, phone off. **A new booking never goes by
  phone**; the phone carries only the morning summary, inquiries, and
  cancellations or changes within the next 24 hours - and on the free plan
  only the morning summary (LT-489); in the free days none by WhatsApp
  (LT-600). If nothing reached the
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
  bookings (the customer gets one cancellation message for them all, LT-562)
  and note a private reason.
- Lighty in the dashboard answers questions from the owner's data ("מה יש לי
  היום?", "מתי אני פנוי מחר?", "סכם לי את השבוע", "יש לידים שלא טיפלתי
  בהם?", "מי הלקוחות הקבועים שלי?"). Since LT-561 it also prepares changes
  the owner asks for - days off, opening hours and special dates, booking
  rules, appointments (book, move, change the service, cancel, mark done),
  leads (status, add to the customers) and customers (a note, block) - each
  shown on a card and done only when the owner confirms it; customers get the
  same messages as when the owner does it by hand. Since LT-564 also
  services (add, name, price, length), products (add, name, price, texts,
  shown or a draft, sold out; pictures on the products page), the owner's
  alerts and the business's name, address and social links; since LT-567 an
  answer to a lead (drafted, sent from the owner's own phone by WhatsApp or
  SMS) and several appointments moved together. Never deletes,
  never the phone, the email, the plan or payments. The web dashboard has it;
  the phone apps only from their next version, so do not promise it in the
  apps yet. Requests to change the site open the editor.
  The percentage beside "שיחה חדשה" is the share of the month's AI quota
  already used.
- Site Lighty (Lightor+ and the free days): answers visitors' questions on the
  site ("יש לכם שאלה? אני כאן") from the site's public information, and
  since LT-563 tells the free times the booking calendar shows ("מה פנוי
  מחר?"), times only, never who booked. It cannot book. It is on
  automatically for those sites.
- The phone app is the dashboard with push alerts, public in both stores
  (checked 2026-11-08, LT-618): **Google Play**
  https://play.google.com/store/apps/details?id=app.lightor.dashboard and the
  **App Store** https://apps.apple.com/app/lightor/id6819305092 (Israel).
  Nothing is bought in the app.
- A private calendar link for the owner's own calendar app (Apple Calendar,
  Google Calendar or Outlook), and, on every plan, a direct Google Calendar
  connection (Settings, "תורים", "סנכרון ל-Google Calendar"; LT-045): every
  booking, change and cancellation goes to the owner's Google Calendar.
  Checked 2026-11-09 (LT-621) from the card and the code; no real Google
  account was connected in the guides batch.
- Support: "דיווח על בעיה" in the dashboard, support@lightor.app.
- No Instagram integration: the owner shares the site link (bio, stories,
  WhatsApp status, Google business profile). The dashboard's home offers the
  link, WhatsApp sharing and a QR code.

## Found on Google and AI search
- Every site carries structured data (LocalBusiness with the services, and a
  Product on each product page), its own sitemap, change notices to search engines (IndexNow: Bing and others, not
  Google), is open to AI search crawlers, and is linked from lightor.app/sites.
- Never promise a ranking or "first page on Google".

## The United States (LT-715)
Checked on 2026-11-24 against `origin/main` of lightor-back (`65f156a`),
lightor-front (`3847224`), lightor-dashboard (`1617f2f`) and lightor-register
(`2e95d71`), and against the live API where it says so. An English article for
a US business may rely on this section, and on the rest of this file where it
is not about Israel only (shekel prices, the 07:00 Israel time, Israeli
numbers).

- **Open countries**: a phone number from outside Israel is accepted only for
  a country the server names (`FIREBASE_PHONE_CODE_REGIONS`, back
  `phoneHelper.ts` `isOpenAbroadPhone`). Live: the United States only
  (`GET https://api.lightor.app/api/messaging/phone-countries` answered
  `{"home":"IL","abroad":["US"]}`). An owner, a business phone and a customer
  may have a US number; the phone fields of the signup, the dashboard and the
  sites' booking and contact forms offer the country (LT-677: register
  `usePhoneCountries.ts`, dashboard and front `services/phoneCountries.ts`).
  A business's country is its business phone's country.
- **Phone codes to a US number** (LT-673, LT-676): the 6-digit code is sent by
  Google's Firebase phone sign-in, not by Lightor's Israeli SMS provider; the
  server checks Firebase's answer (back `POST /api/messaging/otp/firebase`)
  and a gate limits the sends (`/otp/firebase/gate`: never an Israeli number,
  a wait between sends, a daily cap per number).
- **Prices** (LT-695, back `billingMoney.ts` `planPricesFor`, site
  `pricing.html` and `src/lib/localPrices.ts`): a US business is offered
  Lightor+ at **$29 a month or $290 a year** and Lightor Pro at **$49 a month
  or $490 a year**; lightor.app's pricing page and the home's answer about
  prices show a US visitor these. Live on 2026-11-24 (`/api/paddle/prices?country=US`:
  `local: true`, 2900 / 29000 / 4900 / 49000 cents, `included` 500,
  `plusIncluded` 200, an extra booking 17 cents with a $3 smallest charge).
  The plans hold the same as in Israel (Plans, above): 200 bookings a period
  on Lightor+, 500 on Pro. The 60 free days of Lightor+ are for every new
  account. Sales tax at checkout was not checked in the code: do not state it.
- **Customer messages for a US customer today** (LT-694, back
  `notificationService.ts` `sendMessage`): the confirmation, the morning
  reminder, the hour-before reminder (Pro), a move and a cancel go **on
  WhatsApp only**. Lightor has **no SMS sender for the United States yet**: a
  customer who leaves the booking form's switch on SMS (preselected, front
  `Schedule.tsx`) gets the 6-digit code by text and **no confirmation or
  reminder**; a WhatsApp that Meta refuses is not resent by SMS abroad. With
  WhatsApp chosen, the switch reads "Code by SMS, updates via WhatsApp"
  (front `schedule.channel.whatsappAbroad`). A booking the owner makes by hand
  for a US number is stored as WhatsApp (back `appointmentController.ts`).
  **Never promise a US customer text-message confirmations or reminders**
  until this section says otherwise.
- **The texts' language and formats**: the owner's language, Hebrew or English
  (see Bookings); a US business's customer messages write the date and time
  the American way, "Dec 2" and "3:00 PM" (back `notificationService.ts`
  `momentFor`).
- **Consent line** (LT-687, front `TextConsent.tsx`): under the booking form's
  button, for a US number, a short line that the customer agrees to get
  appointment texts from Lightor, with "Msg & data rates may apply", "Reply
  STOP" and links to the text-message sections of Lightor's terms and
  privacy (`#en-sms`). Replies such as STOP are not handled yet (no US sender).
- **Reminders by the business's own clock** (LT-692, back
  `reminderDelivery.ts`): the morning reminder leaves at **07:00 on the
  business's clock**, the hour-before one only between 07:00 and 21:59 there.
- **Time zone by address** (LT-692, back `zoneByAddress.ts`): a US business's
  time zone follows the state in its address (a state field, "Austin, TX", a
  large city's name, a ZIP prefix or town for a split state), set when the
  site is made and again whenever a save changes the address or the business
  phone; an address that names no state leaves the zone as it was (at first,
  the signing-up device's). The owner has **no time-zone setting**.
- **American formats** (LT-702, live 2026-11-23; back
  `utils/businessFormats.ts`, dashboard `utils/businessFormats.ts`, front
  `utils/siteFormats.ts`, all `usesAmericanFormats`): a US business reads the
  12-hour clock and the month before the day in its dashboard, on its site and
  in the owner's own texts. Display only.
- **Not checked**: whether the phone apps are in the US App Store and Google
  Play, sales tax, a real US number receiving a real code. Do not promise
  them.

## Plans (lightor.app/pricing.html)
- Free forever: 15 bookings a month (cancelled ones and the owner's own count),
  3 services, 5 products, 15 inquiries a month, 3 AI site rebuilds a month, 5 AI pictures
  a month for the site build and products made from a few words (none from the
  editor), WhatsApp alerts for the
  owner's morning summary only,
  the "Built with Lightor" badge, the booking confirmation only (no reminders),
  no own domain. At the limit
  the site shows call/WhatsApp buttons. AI editing and the dashboard Lighty run
  on a basic AI model; the free days and the paid plans on a more advanced one
  (the build is the same model on every plan). Never name the models.
- Lightor+: ₪89 a month or ₪890 a year. **Up to 200 bookings a period**, then
  bookings close until the next period; no extras. Unlimited services, 15
  products, **up to 200 inquiries a month**, then the form gives way to call and WhatsApp buttons
  until next month. The morning reminder only, 20 rebuilds a month, 10 AI pictures,
  insights + CSV, no badge, priority support, site Lighty, an own domain.
- History (bookings and inquiries) shown: 2 months on free, 1 year on Lightor+,
  2 years on Lightor Pro. Older is hidden, and an upgrade brings it back; past
  2 years it is deleted on every plan. Customers stay.
- Lightor Pro: ₪119 a month or ₪1,190 a year. **500 bookings a period included**
  (a cancelled booking and each class attendee count) - **not unlimited**.
  Past 500, bookings close until the next period, unless the owner switches on
  "automatic charge for extra bookings" (off by default): then ₪0.35 each.
  Unlimited services and inquiries, 100 products, the hour-before reminder,
  20 rebuilds a month, 40 AI pictures, insights + CSV, no badge, priority support, site
  Lighty, an own domain. A failed payment keeps the site live but closes bookings, inquiries
  and reminders.
- Outside Israel the prices follow the visitor's country (LT-695, 2026-11-19).
  The shekel prices above are Israel's, and what lightor.app and its pricing
  page are written in. A visitor from a country that has prices of its own
  reads those instead, in that country's currency: in the home's answer about
  prices and in every plan price on pricing.html. The United States, as Erel
  decided on 2026-11-15: Lightor+ $29 a month or $290 a year, Lightor Pro $49
  a month or $490 a year; in the stores, a pack of 100 bookings is $16.99.
  Live: on 2026-11-24 `GET https://api.lightor.app/api/paddle/prices?country=US`
  answered `local: true` with these four amounts (see "The United States").
  Articles in Hebrew and Arabic, for Israel, keep the shekel prices; English
  articles for the United States use the dollar ones.
- Every new account: 60 days of Lightor+ free, no credit card, no commitment,
  up to 200 bookings in each 30-day month. Joining Lightor Pro in the free days
  is paid at once and opens all of it at once; the free days left end (LT-589,
  2026-11-05). Once per phone, email, Google or Apple account; it starts once
  the phone is verified. Joining Lightor+ in the free days charges only at day
  60.
- In the free days (a card added in them included) the **owner's alerts**
  have no WhatsApp: they come in the app and by email, and the Account page
  offers no WhatsApp (LT-600, Erel 2026-11-06). It is back when the free days
  end, on any plan. Customers still choose SMS or WhatsApp on the booking
  form. Do not promise the owner WhatsApp alerts in the free days.
