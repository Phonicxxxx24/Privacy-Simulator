Rialo REX Native Privacy Simulator

<div align="center">
<img src="https://res.cloudinary.com/duf6r8fhk/image/upload/v1768581997/Screenshot_2026-01-16_221508_ejoo9f.png" alt="Simulator Preview" width="100%" />






</div>

 # Overview

The Rialo REX Privacy Simulator is an interactive educational tool designed to visually demonstrate the critical difference between standard public blockchain execution and Rialo's Native Privacy (REX) architecture.

Public blockchains expose transaction inputs (like API keys, trades, and PII) to the entire network in the mempool, leading to front-running (MEV) and data leaks. This simulator uses real-time animations to show how Rialo REX uses Trusted Execution Environments (TEEs) to encrypt inputs, execute computation in a "black box" enclave, and produce verifiable proofs without ever leaking secrets.

# Key Features

Interactive Simulation: Toggle between "Public Blockchain" (Chaos/Risk) and "Rialo REX" (Order/Privacy) modes.

Visual Attack Vectors: See how MEV bots and observers intercept public data packets.

Privacy Visualization: Watch data get encrypted and processed inside a secure TEE enclave.

Real-World Use Cases: Explore three core scenarios unlocked by native privacy:

Authenticated Services: Connecting Web2 APIs (Instagram/Google) on-chain.

Private DeFi: Preventing front-running and copy-trading.

Policy Enforcement: Verifying PII (Passport/Nationality) without storage.

Sleek UI: Fully responsive, dark-themed glassmorphism interface built with Tailwind CSS.

# Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS

Animations: Framer Motion

Icons: Lucide React

Deployment: Vercel

 # Project Structure

├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── assets/          # Images and icons
│   ├── App.jsx          # Main application logic
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind directives
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Project dependencies


# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

# License

Distributed under the MIT License. See LICENSE for more information.

# Created By

X : @gaminggop24

GitHub: Phonicxxxx24

*Disclaimer: This visualization is an interpretive representation of Rialo's privacy architecture based on
