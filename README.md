# 🔐 Vault — Secure Browser-Based Crypto Wallet (BIP-39)

Vault is a modern, privacy-focused crypto wallet built with Next.js (App Router) that generates and securely stores BIP-39 recovery phrases directly in the browser.

It uses AES encryption to protect the seed phrase with a user-defined password and never sends sensitive data to any server.

---

## ✨ Features

- 🔑 BIP-39 mnemonic generation (128-bit entropy)
- 🔐 Client-side AES encryption using password protection
- 🧠 Secure localStorage vault storage
- 🎨 Modern UI with Tailwind CSS + Framer Motion
- ⚡ Built with Next.js App Router
- 🛡️ Zero backend — fully browser-based

---

## 🧩 Tech Stack

- Next.js 14 (App Router)
- React
- Tailwind CSS
- Framer Motion
- CryptoJS
- bip39

---

## 🔒 Security

- Seed phrases generated locally
- Encrypted before storage
- Never transmitted to any server
- Password required to decrypt vault
