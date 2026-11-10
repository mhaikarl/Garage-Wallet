# GARAGE / WALLET — iPhone PWA

A dark, mobile-first personal finance and Proton S70 ownership tracker.

## Included
- Monthly dashboard with salary, planned commitments, recorded spending and remaining balance
- Editable S70 instalment, fuel, insurance, road tax, maintenance, toll and parking budget
- Atome and SPayLater outstanding balance and monthly payment tracking
- Everyday expense journal
- Vehicle log for fuel, servicing, tyres, battery, repairs, insurance and road tax
- Emergency savings target
- JSON export/import for manual iCloud Drive backup
- Offline shell via service worker

## Important iCloud limitation
This PWA does **not** connect directly to iCloud or automatically sync a database through iCloud. Records are stored in IndexedDB in the browser on this device. Use **Backup → Export backup**, then save the downloaded JSON file to iCloud Drive in the iOS Files sheet. On another device or after reinstalling, open the app and use **Restore from backup**. Export backups regularly. Safari website data may be cleared by the user or iOS; backups are important.

## Deploy (free static hosting)
You need an HTTPS host for installation and offline service-worker support. GitHub Pages is one straightforward option.

### GitHub Pages
1. Sign in to GitHub and create a new public repository, e.g. `garage-wallet`.
2. Upload all files in this folder to the repository root (not the ZIP file).
3. In repository **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
4. Wait for GitHub Pages to publish. Your address will look like `https://YOUR-USERNAME.github.io/garage-wallet/`.
5. Open that HTTPS address in **Safari** on your iPhone.

### Add to iPhone Home Screen
1. Open the published URL in Safari (not an in-app browser).
2. Tap the Share icon.
3. Scroll and tap **Add to Home Screen**.
4. Enable **Open as Web App** if the option appears, then tap **Add**.
5. Launch Garage Wallet from the Home Screen.

## First setup
The app is prefilled with planning estimates discussed:
- Net salary RM2,440; payday 25
- S70 instalment RM783
- Petrol RM170; insurance provision RM196; road tax RM8
- Maintenance provision RM125; toll/parking RM200
- Atome balance estimate RM850 and planned monthly payment RM425
- SPayLater monthly payment RM499; total outstanding balance left at RM0 because the total is not yet known
- Savings RM10,000 (placeholder floor based on “above RM10,000”; replace with exact figure)
- Phone/subscriptions/bills RM0 until entered

Replace every estimate with confirmed amounts. The car instalment and OTR price are not bank-verified. Insurance provision is a monthly sinking-fund estimate. Do not treat the monthly payment fields as the total outstanding BNPL balance.

## How to use
- Update recurring costs under **My S70** and save.
- Update income, bills and savings under **Money**.
- Record each everyday expense under **Activity**.
- After paying Atome/SPayLater, use **Record payment**. This reduces the outstanding balance and records the payment as a current-month expense. The monthly planned payment field remains as the budget estimate; adjust it as the schedule changes.
- Vehicle service and fuel history belongs in the **Vehicle log**.
- Export a JSON backup to iCloud Drive regularly.

## Privacy & limitations
- No bank integrations, no Atome/Shopee integrations, no automatic bill reminders or push notifications.
- No password/Face ID lock is implemented. Use your iPhone passcode and keep the device secure.
- App records are local to this browser profile. Clearing Safari website data may delete them.
- The Google Fonts import is optional; the app uses system fonts if unavailable.
- This is a budgeting tool, not financial, insurance or tax advice.

## Local testing
For a local test, run a static HTTP server from this folder (not by opening index.html as a file):
`python3 -m http.server 8000`
Then visit `http://localhost:8000` on your computer. For iPhone installation, deploy to HTTPS.
