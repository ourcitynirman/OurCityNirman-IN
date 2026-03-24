#we need to change github command
git config --global user.name "Our City Nirman Pvt Ltd"
git config --global user.email "company-email@example.com"

git commit --amend --author="Our City Nirman Pvt Ltd <company-email@example.com>"
git push --force



# Our City Nirman — Coming Soon Landing Page

A premium, professional **"Coming Soon"** landing page for **Our City Nirman Pvt Ltd** built with:

- ⚡ **Vite** (React + Fast HMR)
- ⚛️ **React 18**
- 🛣️ **React Router DOM v6** (multi-page routing)
- 🎨 **Tailwind CSS** (utility-first styling)

---

## 📁 Project Structure

```
our-city-nirman/
├── public/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   ├── ComingSoon.jsx    ← Main landing page (/)
│   │   ├── Register.jsx      ← Early access form (/register)
│   │   └── ThankYou.jsx      ← Success page (/thank-you)
│   ├── App.jsx               ← Router setup
│   ├── main.jsx              ← App entry point
│   └── index.css             ← Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

Open: **http://localhost:5173**

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm preview
```

---

## 📱 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Coming Soon | Hero, features, countdown timer |
| `/register` | Register | Early access form with validation |
| `/thank-you` | Thank You | Success + auto-redirect to home |

---

## 🎨 Design Features

- 🌑 **Dark Navy Theme** (#0a1628 background)
- 🟠 **Orange Brand Accent** (#f97316)
- ✨ **Glassmorphism Cards** with backdrop blur
- 🔵 **Ambient glow blobs** + grid pattern background
- ⏱️ **Live Countdown Timer** (60-day launch countdown)
- 🎭 **Smooth animations** (float, fade-up, pulse)
- 📱 **Fully Responsive** — Mobile, Tablet, Desktop
- ♿ **Accessible** — semantic HTML, proper labels

---

## 📞 Contact Info (embedded in app)

- 🌐 [www.ourcitynirman.in](https://www.ourcitynirman.in)
- 📞 +91 85538 66059
- 📞 +91 91029 05387
- 📍 Simanpur, Pirpainti, Bihar — 813209

---

## 🛠️ Customization

**Change countdown target:** Edit the `target` date in `ComingSoon.jsx` → `CountdownTimer` component

**Add form backend:** Replace the `setTimeout` in `Register.jsx` → `handleSubmit` with your API call

**Update colors:** Edit `tailwind.config.js` → `theme.extend.colors`

---

*© Our City Nirman Pvt Ltd — All Rights Reserved*
