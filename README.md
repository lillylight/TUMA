# Document Exchange Platform

A secure, blockchain-powered document exchange platform with onchain payments and permanent storage on Arweave.

## 🚀 Features

- **Secure File Transfers**: End-to-end encrypted document sharing
- **Blockchain Payments**: Pay with USDC via Coinbase/OnchainKit
- **Permanent Storage**: Files stored on Arweave
- **Modern UI**: Built with React, TypeScript, and Shadcn UI

## 🚀 Deployment to Vercel

### Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [GitHub Account](https://github.com)
- [Coinbase Commerce API Key](https://commerce.coinbase.com/dashboard/settings)
- [Arweave JWK](https://www.arweave.org/wallet)

### Deployment Steps

1. **Fork the Repository**
   - Fork this repository to your GitHub account

2. **Deploy to Vercel**
   - Click the button below to deploy to Vercel
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&env=VITE_PUBLIC_ONCHAINKIT_API_KEY,VITE_PUBLIC_PRODUCT_ID,VITE_COINBASE_COMMERCE_API_KEY,VITE_ARWEAVE_JWK_JSON,ARWEAVE_JWK_PATH&envDescription=Environment%20variables%20required%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdocu-exchange%23environment-variables)

3. **Configure Environment Variables**
   - Add the following environment variables in your Vercel project settings:
     ```
     VITE_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
     VITE_PUBLIC_PRODUCT_ID=your_product_id
     VITE_COINBASE_COMMERCE_API_KEY=your_coinbase_commerce_api_key
     VITE_ARWEAVE_JWK_JSON=your_arweave_jwk_json
     ARWEAVE_JWK_PATH=./arweave-jwk.json
     ```

4. **Deploy**
   - Push your changes to trigger a new deployment
   - Vercel will automatically build and deploy your application

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/docu-exchange.git
   cd docu-exchange
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the required environment variables (see `.env.example`)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the backend server**
   ```bash
   node server.cjs
   ```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_PUBLIC_ONCHAINKIT_API_KEY` | API key for OnchainKit | Yes |
| `VITE_PUBLIC_PRODUCT_ID` | Product ID for the application | Yes |
| `VITE_COINBASE_COMMERCE_API_KEY` | API key for Coinbase Commerce | Yes |
| `VITE_ARWEAVE_JWK_JSON` | Arweave wallet JSON (stringified) | Yes |
| `ARWEAVE_JWK_PATH` | Path to Arweave wallet file | Yes |

## 📄 Project Overview

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
