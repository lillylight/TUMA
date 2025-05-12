# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8cb3debd-527b-481c-a25c-e91386c5b662

## 📄 Project Overview

A secure, blockchain-powered document exchange platform with:
- **Onchain payments** (USDC via Coinbase/OnchainKit)
- **Permanent storage** (Arweave)
- **End-to-end encryption**
- **Modern, responsive UI**

## 🚀 User & Technical Flow

1. **Connect Wallet**
   - Users connect via MetaMask or Coinbase Wallet.

2. **Send Files**
   - Select a file, enter recipient wallet address, and an optional message.
   - Service fee (in USDC) is calculated and shown.
   - Payment handled onchain using OnchainKit `<Checkout />`.
   - **File is only uploaded after successful payment!**
   - File is encrypted and uploaded to Arweave using the app owner's wallet.
   - Metadata (name, type, sender, recipient, timestamp, etc.) is stored as Arweave transaction tags.
   - Recent recipients are tracked and shown for quick selection.

3. **View Documents**
   - Dashboard shows sent and received documents (sortable, filterable, paginated).
   - Users can download and decrypt files (only sender or recipient can decrypt).

4. **Recent Recipients**
   - Up to 5 recent recipients are tracked in local storage and shown in the UI.

5. **Payment Status UX**
   - Payment dialog gives clear feedback: processing, success, error, and allows retrying failed payments.

## ⚠️ Security Notes

- **Arweave JWK Security**
  - For local development, the Arweave JWK (wallet key) is loaded from `/public/arweave-jwk.json`.
  - **Never use this approach in production!**
  - In production, serve the JWK securely from a backend API and never expose it to the public web.

- **Encryption**
  - Files are encrypted before upload. Only sender and recipient can decrypt.

- **User Funds**
  - Users only pay a fixed service fee in USDC. The app owner’s wallet pays for Arweave storage.

- **Error Handling**
  - Robust error handling for upload, payment, and decryption. User-friendly toasts for all major actions.

## 📱 Mobile Responsiveness
- The UI is designed to be responsive and mobile-friendly. Test on different devices for best results.

## 🛠️ Improvements & TODOs
- [x] Recent recipients logic (local storage)
- [x] Robust file decryption/download error handling
- [x] Granular payment status feedback and retry logic
- [x] Mobile-friendly UI (test and tweak as needed)
- [ ] Production JWK security (backend API)
- [ ] Email notifications for recipients
- [ ] Payment history view
- [ ] Accessibility (a11y) review
- [ ] Add more tests & documentation

## 📝 How to Run Locally

1. Clone the repo and install dependencies:
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm install
   npm run dev
   ```
2. Copy your Arweave JWK to `public/arweave-jwk.json` (for local dev only).
3. Set up your `.env` with the required keys (see below).

## 🧩 Environment Variables

- `VITE_PUBLIC_PRODUCT_ID` (OnchainKit product ID)
- `VITE_ARWEAVE_JWK_PATH` (Path to JWK, only used if you implement backend API for prod)
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`, etc. for payment/wallet integrations

## 🛡️ Production Deployment Checklist
- Serve the Arweave JWK via a secure backend API (never expose in `/public`)
- Configure environment variables for production
- Enable HTTPS
- Review all error handling and a11y

## 🙋 Need Help?
Open an issue or contact the maintainer!

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8cb3debd-527b-481c-a25c-e91386c5b662) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
