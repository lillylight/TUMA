import { useState } from "react";
import { ArrowRight, CheckCircle, Shield, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/use-wallet";
import ConnectButton from "@/components/ConnectButton";

const Landing = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [isHovering, setIsHovering] = useState(false);

  // If wallet is connected, redirect to send page
  if (isConnected) {
    navigate("/");
    return null;
  }

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-doc-deep-blue dark:text-blue-400" />,
      title: "Secure Document Sharing",
      description: "End-to-end encryption ensures your documents remain private and secure."
    },
    {
      icon: <Wallet className="h-6 w-6 text-doc-deep-blue dark:text-blue-400" />,
      title: "Blockchain-Powered",
      description: "Built on Base network with Arweave storage for permanent, decentralized document storage."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-doc-deep-blue dark:text-blue-400" />,
      title: "Simple Pricing",
      description: "Pay once for permanent storage. No subscriptions or hidden fees."
    }
  ];

  const pricingTiers = [
    { size: "Below 10MB", price: "$1.00" },
    { size: "11MB to 30MB", price: "$1.50" },
    { size: "30MB to 60MB", price: "$2.00" },
    { size: "61MB to 100MB", price: "$2.50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/70 mix-blend-multiply z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
        
        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                TUMA
              </span>
            </div>
            <div>
              <ConnectButton />
            </div>
          </div>
        </header>
        
        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 sm:py-48 lg:py-56 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md">
              Secure Document Sharing
            </h1>
            <div className="mt-6 bg-white/10 backdrop-blur-sm p-6 rounded-xl inline-block max-w-2xl">
              <p className="text-lg leading-8 text-white/90">
                Share documents securely with blockchain-powered encryption and permanent storage. 
                Connect your wallet to start sending and receiving documents.
              </p>
            </div>
            {/* Buttons removed as requested */}
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="currentColor" className="text-white dark:text-gray-900" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500"/>
                <circle cx="0" cy="0" r="1" fill="currentColor" className="text-blue-600"/>
              </pattern>
              <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0063F5" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#0063F5" stopOpacity="0"/>
              </linearGradient>
              <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#0063F5" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#0063F5" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
            <circle cx="20%" cy="30%" r="300" fill="url(#glowGradient)" />
            <circle cx="80%" cy="70%" r="250" fill="url(#glowGradient)" />
          </svg>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-doc-deep-blue dark:text-blue-400">Secure by Design</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need for secure document sharing
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              TUMA provides a seamless experience for sending and receiving documents with blockchain security and permanent storage.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 sm:py-32 pb-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-doc-deep-blue dark:text-blue-400">Pricing</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Pay once for permanent storage. No subscriptions or hidden fees.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pricingTiers.map((tier, index) => (
                <div key={index} className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-6 text-center shadow-sm ring-1 ring-inset ring-blue-200 dark:ring-blue-800">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">{tier.size}</h3>
                  <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.price}</p>
                  <p className="mt-6 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    One-time payment for permanent storage
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connect Button Section - Between Pricing and CTA */}
      <div className="py-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex justify-center">
        <div className="flex items-center justify-center gap-x-6 bg-white dark:bg-gray-800 px-8 py-4 rounded-full shadow-lg z-20">
          <ConnectButton />
          <button 
            onClick={() => navigate("/about")}
            className="text-sm font-semibold leading-6 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all flex items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Learn more <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${isHovering ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
        
      {/* CTA Section */}
      <div className="py-24 sm:py-32 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500"/>
                <circle cx="0" cy="0" r="1" fill="currentColor" className="text-blue-600"/>
              </pattern>
              <linearGradient id="fadeGradient-cta" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0063F5" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#0063F5" stopOpacity="0"/>
              </linearGradient>
              <radialGradient id="glowGradient-cta" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#0063F5" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#0063F5" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-cta)"/>
            <rect width="100%" height="100%" fill="url(#fadeGradient-cta)" />
            <circle cx="70%" cy="30%" r="250" fill="url(#glowGradient-cta)" />
            <circle cx="30%" cy="70%" r="300" fill="url(#glowGradient-cta)" />
          </svg>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Connect your wallet to start sending and receiving documents securely.
            </p>
            {/* Buttons moved to the top */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
              &copy; 2025 TUMA, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
