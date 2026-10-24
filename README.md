# Pitstop

A responsive, India-first vehicle care web application with a quick-commerce shopping flow and a calm, Apple-inspired interface. Built with native JavaScript, CSS and Node.js. No dependency installation or API keys required.

## Run locally

1. Install Node.js 20 or newer if it is not already available.
2. Open a terminal in this folder.
3. Run `npm start`.
4. Open **http://127.0.0.1:3000**.

On Windows, you can also double-click **Start Pitstop.cmd**. Keep its terminal window open while using the app. Press Ctrl+C to stop the server.

If port 3000 is occupied, use PowerShell: `$env:PORT=3001` followed by `npm start`. Open the corresponding port in your browser.

## What works

- Responsive storefront with original SVG artwork, mobile navigation, service categories, search, sorting and saved favourites.
- 24 service offerings covering scooters, motorcycles, superbikes, cars and EVs. Availability and illustrative prices adapt to the selected vehicle.
- Every service opens a configuration dialog: select a saved vehicle, package / scope and applicable specifications. Oil has brand, viscosity, litres and an optional filter; batteries have brand and Ah; tyres have size and position; fuel has litres and fuel-type confirmation.
- Itemised parts / consumables, fuel, labour and fees, a persistent multi-vehicle cart and editable configurations. FIRSTFIX offers 15% off first-booking labour, minimum ₹499 eligible labour, capped at ₹150; parts, fuel and fuel handling are excluded.
- Parts & accessories marketplace with 49 reference / demo listings across 10 categories, search by name / brand / part number, preliminary vehicle filters, source filters and price sorting.
- Parts delivery only or delivery + installation with 25% off installation labour. Save sourcing requests for unlisted parts with your vehicle, OEM number, notes and optional catalogue link.
- A saved vehicle garage, multiple addresses in six Indian demo cities, and a local profile with Indian mobile number and registration format validation.
- Guided Car, Bike, Scooty, Superbike and Electric vehicle selection, dependent brand/model dropdowns, optional model year, fuel/power type, custom entries for unlisted vehicles, and duplicate registration checks.
- Account → Saved vehicles & documents, with per-vehicle registration/RTO, insurance policy and PUC details, manually entered expiry dates, and garage reminders for upcoming and passed expiries.
- Manual challan records with reference, date, amount, reason, location and unpaid/paid/disputed status. Edit, remove or mark a record as paid; no challan lookup or payment is performed.
- Checkout with address selection, ASAP or scheduled arrival slots in India time, service notes, pay-after-service / pay-on-delivery preferences, price breakdown and demo consent.
- Bookings saved by the server, illustrated tracking, an explicit button to advance simulated stages, cancellation rules, booking history and completed-service ratings.
- Server-authoritative pricing, vehicle compatibility checks, coupon eligibility checks, input validation, request size limits, local-origin checks and persistent booking snapshots.
- Keyboard navigation, dialog focus management, reduced-motion support, accessible form labels, feedback messages and empty states.
- Rotating Castrol, Honda Activa and ACKO demo home advertisements, with manual slide navigation, play / pause and reduced-motion support. Buttons open relevant service options or saved insurance records.
- Three fictional star-mechanic profiles: Royal Enfield, Honda Activa and pre-purchase inspection specialists, with sample experience / ratings and AI-generated photorealistic branded portraits.
- Daily-care subscriptions for car washing, tyre pressure checks and glass cleaning, with saved vehicles, preferred visit windows, calendar-based pricing and locally saved plan management.

## Daily-care subscriptions

Open **Daily care** from the navigation, or **Build your daily plan** on Home / All services. Select a saved vehicle, services, a 7- or 30-calendar-day term, every-day or Monday–Saturday visits, a start date from tomorrow to 30 days ahead, a preferred visit window in India time, address and contact details.

Demo per-visit rates are ₹79 for car wash, ₹19 for pressure checking and ₹29 for glass cleaning. Wash and glass cleaning are car-only; pressure checks support every saved vehicle category. Two or more services receive 15% off the entire plan estimate, rounded to the nearest rupee. Sundays are excluded from Monday–Saturday pricing, and only planned visit dates are charged in the estimate. Selected supplies and labour are included, with no extra visit fee or auto-renewal.

Plans are saved separately from the one-off cart, visible on **Daily care** and **My orders**, and retain their original vehicle, address, calendar and price snapshots. Overlapping plans for the same vehicle and service are rejected. Pause / resume changes the local plan status; paused visits are skipped without extending the end date or changing the saved estimate. Cancellation stops remaining demo visits and preserves history. Ended plans cannot resume. No payments, recurring charges, real visits, reminders or background dispatch are performed.

## Demo ads and mechanic portraits

Home ads rotate every 6.5 seconds unless paused, hovered, focused, hidden, or a dialog is open. Reduced-motion users start with rotation paused. Ads are fictional creative concepts, with no live offer or brand relationship. ACKO’s banner opens your saved insurance details and does not provide an insurance quote or purchase flow.

Star mechanics and their ratings / jobs / experience are invented demo content. Portraits were generated with the built-in image-generation tool, not photographs of actual staff. Uniform logos are concept artwork. Their service buttons open compatible service options and do not reserve a specific individual. See `DESIGN-ASSETS.md` for the asset path and generation prompt.

## Vehicle details, documents and challans

Open **Account → Saved vehicles & documents → Manage vehicles**, or **My garage**. Use **Add vehicle** to select a vehicle type, brand, model and year. The brand/model catalogue is a starter list rather than a complete or current registration database. “Other / not listed” supports custom brands and models; year choices are not verified against manufacturer production years.

Each saved vehicle has **Documents & challans** with three sections:

- **Overview** shows saved identity, document expiry indicators and challan totals.
- **Documents** saves registration date, registering RTO and RC valid-until date; insurer, policy number, start and expiry dates; and PUC certificate number, issue and expiry dates. Fields are optional. Enter the dates printed on your documents; the app does not infer statutory validity periods. PUC reminders are excluded for vehicles recorded as electric, while any existing PUC data is retained.
- **Challans** saves your own records and status. Marking one paid only changes that local record; it never makes or verifies a payment. No recorded challans does not establish that there are no pending challans.

Expiry reminders use India calendar dates: today through the next 30 days is upcoming; a date before today is past expiry. They appear when the garage or records are viewed. No background alerts, SMS or push notifications are sent. Government, traffic authority and insurer data connections are not present, and saved records are not externally verified. Existing vehicle records remain compatible, and identity edits preserve documents and challans. Existing bookings retain their original vehicle snapshot.

## Demo boundaries

This is a **local booking and shopping demo**, not a production marketplace. No real mechanic is dispatched, stock reserved, supplier contacted, money collected, OTP sent, map tracked, or support call/chat made. Ratings, arrival estimates and mechanic identity are illustrative. Fuel orders include illustrative fuel costs (petrol ₹105/L, diesel ₹95/L) and ₹149 handling; these are not live pump rates.

There is one shared local profile. The server binds to `127.0.0.1` and is intended for use on your own computer. Do not expose it publicly. Authentication, separate customer/provider accounts, identity verification, live coverage, provider dispatch, maps, payment gateways, SMS, tax invoicing, notifications, operational tools and production deployment require real integrations and further implementation.

Fuel supply and delivery would require authorized providers and launch-specific operating arrangements. High-voltage EV work is excluded. Specialist listings identify scheduled workshop installation. Only selected parts, fluids and work are included; additional repairs need a separate quote and approval.

## Catalogue sources, fitment and pricing

The browse / garage / part-number workflow refers to [Boodmo’s public help](https://help.boodmo.com/knowledge/article/35). Pitstop is not affiliated with Boodmo or the listed manufacturers, and does not mirror their complete catalogue.

Eight listings carry public manufacturer / OEM price references, checked on 18 October 2026: [Maruti Suzuki oil filter 16510M73070](https://www.marutisuzuki.com/genuine-parts/oil-filter/16510m73070), six entries from the [Swift LDI catalogue](https://www.marutisuzuki.com/genuine-parts/swift-from-aug-2011/2011-till-present/ldi), and [Exide RIDE700L](https://www.exidecare.com/find-exide/products/exide-ride/ride700l). Source links and part numbers appear in the app. Reference MRPs are not live offers. Other listings and prices are explicitly labelled illustrative demos.

There is no complete all-India parts database, live inventory, authorized genuine-parts supply relationship, or verified VIN / year / engine / variant fitment. Category and available model-family filtering is preliminary. Battery Ah suggestions depend on category only, not the exact model: OEM capacity, CCA, terminal layout, dimensions and voltage must match. Oil grade, specification and fill volume need manufacturer confirmation. Users record a specification check, while supplier fitment remains pending. Unlisted specifications can be saved as sourcing requests; these never contact an external seller or promise a quote.

Installation discounts apply only to marketplace installation labour. Visit fees are ₹49 below ₹999 when service / installation is needed. Parts-only delivery is ₹29 below ₹999; fuel handling replaces that fee for mixed fuel / parts delivery. Delivery estimates of 30–45 minutes and service arrival estimates of 45–90 minutes are simulations. Existing cart entries require configuration review; changing saved vehicle identity invalidates its earlier configuration. Saved orders preserve original vehicles, options and prices.

## Data and reset

The server creates `data/store.json` on first launch. This contains the profile, addresses, garage, bookings, daily-care subscriptions and part sourcing requests, and should be kept private. Cart, favourites and selections are stored in the browser under `pitstop:` keys. Browser storage and server data are separate; use the same browser origin and port to keep your cart.

To reset the demo: stop the server, delete this project's `data` folder, clear this site's browser storage, then restart. No real customer data is bundled.

## Development

- `npm run dev` — restart the server when source files change. Refresh the browser for frontend updates.
- `npm run check` — JavaScript syntax checks.
- `npm test` — isolated API tests using temporary data, including pricing, discounts, compatibility, validation, lifecycle transitions, cancellation, persistence and cross-origin protection.

## Project layout

```text
server.mjs           Local HTTP server and JSON API
public/index.html    Application entry point
public/app.js        Storefront, garage, cart and booking flows
public/catalog.js    Service catalogue and shared pricing rules
public/commerce.js   Parts catalogue, configurations and authoritative quotes
public/shop-ui.js    Marketplace, options, cart, requests and order screens
public/shop.css      Responsive commerce styles
public/care.js       Daily-care services, calendars, quotes and plan status
public/care-ui.js    Home ads, mechanic profiles and subscription screens
public/care.css      Responsive home and daily-care styles
public/assets/star-mechanics.png AI-generated demo portrait triptych
public/art.js        Original SVG illustrations and icons
public/styles.css    Responsive visual system
public/vehicle-data.js Vehicle catalogue, dates and expiry calculations
public/vehicle-ui.js Saved vehicle, document and challan screens
public/vehicles.css  Responsive vehicle-record styles
vehicle-records.mjs  Server validation for vehicle records
tests/api.test.mjs   Automated API checks
tests/vehicle-records.test.mjs Vehicle, expiry and challan lifecycle checks
tests/commerce.test.mjs Options, fitment checks, itemised quotes and shopping API
tests/care.test.mjs  Daily-care pricing, validation and plan lifecycle
data/store.json      Created on first run; not included in source
```

To edit services, update `public/catalog.js`; parts, options and itemised estimates live in `public/commerce.js`. Reference prices and demo estimates use INR. This project loads no external fonts, images, scripts or analytics, so it runs offline once Node.js is installed. Optional manufacturer and marketplace reference links require internet access.
