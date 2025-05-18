# TUMA - Trusted Universal Media Access

## 🌟 Introduction

TUMA is a cutting-edge, blockchain-powered document exchange platform that revolutionizes how sensitive files are shared and stored. Built with security and user experience at its core, TUMA leverages decentralized technologies to provide a seamless, trustless environment for document exchange.

## 🚀 Key Features

- **End-to-End Encryption**: All files are encrypted before leaving your device, ensuring only intended recipients can access them.
- **Blockchain-Powered**: Built on the Base network for secure, transparent transactions.
- **Permanent Storage**: Leverages Arweave for immutable, permanent file storage.
- **Simple Pricing**: Clear, transparent pricing based on file size with no hidden fees.
- **User-Friendly Interface**: Intuitive design that works seamlessly across all devices.
- **Wallet Integration**: Easy connection with popular Web3 wallets like MetaMask and Coinbase Wallet.

## 🛠️ How It Works

### For Senders
1. **Connect Your Wallet**
   - Securely connect your preferred Web3 wallet (MetaMask, Coinbase Wallet, etc.)
   - No personal information required - your wallet is your identity

2. **Upload & Send Files**
   - Select any file from your device (various formats supported)
   - Enter the recipient's wallet address
   - Add an optional message for context
   - View the transparent, size-based fee in USDC

3. **Secure Payment**
   - Approve the transaction in your wallet
   - Pay the one-time service fee in USDC
   - Your file is encrypted and uploaded only after successful payment

4. **Confirmation**
   - Receive instant confirmation when the file is securely stored
   - The recipient is automatically notified

### For Recipients
1. **Receive Notification**
   - Get notified when someone sends you a file
   - View the sender's wallet address and any included message

2. **Access Your Files**
   - Connect your wallet to view received files
   - Download and decrypt files with a single click
   - All files are stored permanently and can be accessed anytime

## 💼 Use Cases

### For Businesses
- **Legal Firms**: Securely share sensitive legal documents with clients
- **Healthcare Providers**: Exchange medical records while maintaining HIPAA compliance
- **Real Estate**: Share contracts and property documents with buyers/sellers
- **Financial Services**: Securely transmit financial statements and sensitive data

### For Individuals
- **Personal Documents**: Share important files like IDs, certificates, or tax documents
- **Creative Work**: Share high-resolution media files with clients or collaborators
- **Academic Use**: Exchange research papers or academic documents securely

## 🔒 Security & Privacy

### Advanced Security Features
- **Military-Grade Encryption**: Files are encrypted before they leave your device
- **Zero-Knowledge Architecture**: We never have access to your files or encryption keys
- **Immutable Records**: All transactions are recorded on the blockchain for auditability
- **No Centralized Storage**: Files are stored on the decentralized Arweave network

### Privacy First
- No personal data collection
- No tracking or analytics
- Your wallet is your only identifier
- Complete control over your data

## 💰 Pricing

Our transparent pricing is based on file size:

| File Size       | Price (USDC) |
|----------------|-------------:|
| Up to 10MB     |        0.05  |
| 10MB to 50MB   |        1.00  |
| 50MB to 100MB  |        2.00  |
| >100MB         |        5.00  |


## 🚀 Getting Started

### Prerequisites
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- USDC for transaction fees
- Modern web browser (Chrome, Firefox, Brave, or Edge)

### Quick Start
1. Visit [tuma.basezambia.org](https://tuma.basezambia.org)
2. Connect your wallet
3. Start sending and receiving files securely

## 🌐 Technology Stack

- **Frontend**: React.js with TypeScript
- **Blockchain**: Base Network
- **Storage**: Arweave
- **Payments**: USDC on Base
- **Encryption**: AES-256-GCM
- **UI Components**: Shadcn UI

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Report bugs or suggest features
2. Submit pull requests
3. Help improve documentation
4. Spread the word about TUMA

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For inquiries or support, please contact us at [contact@basezambia.org](mailto:contact@basezambia.org)

## 🌟 Acknowledgements

- Base Network for the blockchain infrastructure
- Arweave for permanent, decentralized storage
- The open-source community for invaluable tools and libraries

## 🚀 Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Basezambia/Tuma.git
   cd Tuma
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_PUBLIC_PRODUCT_ID=your_product_id
   # Add other required environment variables
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## 🛡️ Security Best Practices

### For Developers
- Never commit sensitive information to version control
- Use environment variables for all secrets and API keys
- Implement proper error handling and input validation
- Keep all dependencies up to date

### For Users
- Always verify the website URL before connecting your wallet
- Never share your private keys or seed phrases
- Use hardware wallets for large transactions
- Keep your wallet software up to date

## 🤝 Community & Support

Join our community to stay updated and get support:

- [GitHub Discussions](https://github.com/Basezambia/Tuma/discussions)
- [Twitter](https://twitter.com/BaseZambia)
- [Discord](https://discord.gg/BaseZambia)

## 📈 Roadmap

### Q2 2025
- [x] Launch Beta Version
- [x] Implement Core Features
- [ ] Mobile App Development

### Q3 2025
- [ ] Advanced File Management
- [ ] Multi-chain Support
- [ ] Enterprise Features

### Q4 2025
- [ ] API for Developers
- [ ] Browser Extension
- [ ] Decentralized Identity Integration

## 🌟 Why Choose TUMA?

- **Decentralized**: No single point of failure
- **Secure**: End-to-end encryption for all files
- **Transparent**: All transactions are on-chain
- **User-Friendly**: Simple interface for everyone
- **Cost-Effective**: Pay only for what you use

## 📚 Resources

- [Documentation](https://docs.tuma.basezambia.org)
- [API Reference](https://api.tuma.basezambia.org)
- [Whitepaper](https://tuma.basezambia.org/whitepaper)
- [Blog](https://blog.basezambia.org)

## 🎯 Our Mission

At BaseZambia, we believe in a future where data privacy and security are fundamental rights. TUMA is our contribution to a more secure and decentralized web, where users have full control over their digital assets and communications.

Join us in building the future of secure file sharing!
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

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
