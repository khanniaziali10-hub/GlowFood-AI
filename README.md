# 🌿 GlowFood AI
<img width="941" height="453" alt="Screenshot 2026-05-17 172402" src="https://github.com/user-attachments/assets/25643157-239a-46b3-a999-b5a21f399a48" />



An AI-powered smart pantry manager that scans barcodes, tracks expiry dates, and suggests waste-reducing recipes using Google Gemini AI. Built with Next.js 15, React Three Fiber, and Tailwind CSS.

![GlowFood AI](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 📱 **Smart Pantry Management**
- **QR/Barcode Scanning**: Instantly add items by scanning product barcodes
- **Auto-categorization**: Items automatically sorted into categories (Dairy, Produce, Meat, etc.)
- **Visual Dashboard**: Beautiful cards with emojis, quantities, and expiry badges

### ⏰ **Intelligent Expiry Tracking**
- **Color-coded Status System**:
  - 🟢 Safe (7+ days)
  - 🟡 Warning (3-7 days)
  - 🟠 Danger (1-2 days)
  - 🔴 Expired (past date)
- **Smart Alerts**: Items nearing expiry "glow" with pulsing animations
- **Priority Sorting**: Most urgent items appear first

### 🤖 **AI Recipe Assistant (Gemini-Powered)**
- **Waste-Reduction Chef**: AI prioritizes ingredients about to expire
- **Smart Combinations**: Get recipe suggestions based on what you have
- **Conversational Interface**: Natural language chat
- **Nutritional Advice**: Ask about calories, protein, meal prep tips

### 🎨 **3D Interactive UI**
- **Anti-Gravity Hero Section**: Floating 3D fruits/vegetables using React Three Fiber
- **Smooth Animations**: Framer Motion for buttery transitions
- **Glow Theme**: Dusty rose, soft apricot, and lavender color palette
- **Mobile-First Design**: Fully responsive across all devices

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- **Gemini API Key** (free at [Google AI Studio](https://aistudio.google.com/app/apikey))
- **Supabase Account** (optional - app works in Demo Mode without it)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/glowfood.git
cd glowfood
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
# Copy the example file
copy .env.local.example .env.local

# Edit .env.local and add your keys:
# - GEMINI_API_KEY (required for AI Chef)
# - NEXT_PUBLIC_SUPABASE_URL (optional)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup (Optional)

GlowFood AI works in **Demo Mode** without a database, but for persistent storage:

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor
4. Run the schema from `supabase/schema.sql`
5. Copy your project URL and anon key to `.env.local`

---

## 📁 Project Structure

```
glowfood/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with 3D hero
│   │   ├── pantry/
│   │   │   └── page.tsx          # Pantry management dashboard
│   │   ├── chat/
│   │   │   └── page.tsx          # AI Chef chat interface
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts      # Gemini API integration
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── HeroScene.tsx         # 3D floating food scene
│   │   ├── PantryCard.tsx        # Individual item card
│   │   ├── ExpiryBadge.tsx       # Color-coded expiry indicator
│   │   ├── AddItemModal.tsx      # Add/edit item form
│   │   └── QRScanner.tsx         # Barcode scanner component
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   └── pantry-utils.ts       # Utility functions
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── supabase/
│   └── schema.sql                # Database schema
└── public/                       # Static assets
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Why It's Future-Proof |
|------------|---------|----------------------|
| **Next.js 15** | Framework | Industry standard for React apps with SSR/SSG |
| **TypeScript** | Language | Type safety prevents bugs in large applications |
| **Tailwind CSS 4** | Styling | Rapid UI development, most popular CSS framework |
| **React Three Fiber** | 3D Graphics | AR/VR integration is a major trend in 2026 |
| **Google Gemini AI** | AI Integration | Latest multimodal AI from Google |
| **Supabase** | Database | PostgreSQL with real-time capabilities |
| **Framer Motion** | Animations | Industry-standard animation library |
| **html5-qrcode** | QR Scanning | Browser-based barcode scanning |

---

## 🎯 Key Features Explained

### 1. QR Code Scanning
- Uses device camera to scan product barcodes
- Automatically extracts product information
- Falls back to manual entry if scanning fails

### 2. Expiry Date Intelligence
- Calculates days until expiry in real-time
- Visual alerts with color-coded badges
- Pulsing animations for urgent items
- Smart sorting: expired → danger → warning → safe

### 3. AI Recipe Suggestions
- Gemini AI analyzes your entire pantry
- Prioritizes ingredients about to expire
- Generates personalized recipes
- Provides nutritional information
- Conversational chat interface

### 4. 3D Anti-Gravity Scene
- Interactive floating food models
- Mouse-reactive camera movement
- Smooth animations using Three.js
- Optimized for performance

---

## 🔧 Configuration

### Gemini API Setup
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to `.env.local` as `GEMINI_API_KEY`

### Supabase Setup (Optional)
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Run `supabase/schema.sql` in SQL Editor
4. Copy URL and anon key to `.env.local`

---

## 📱 Usage Guide

### Adding Items
1. Click **"+ Add Item"** or **"Scan"** button
2. For scanning: Point camera at barcode
3. For manual: Fill in item details
4. System auto-suggests emoji and expiry date

### Managing Pantry
- **Search**: Find items by name or category
- **Filter**: View by category or urgency
- **Edit**: Click "Edit" on any item card
- **Delete**: Click "Remove" to delete items

### Using AI Chef
1. Navigate to **"AI Chef"** page
2. View urgent items banner
3. Ask questions like:
   - "What should I cook first?"
   - "Give me a dinner recipe"
   - "Meal prep ideas for this week"
4. AI prioritizes expiring ingredients

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Add these in your Vercel project settings:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is built for educational purposes as part of FA24-BCS-120 coursework.

---

## 👨‍💻 Author

**M Ali Asad Khan**  
Student ID: FA24-BCS-120

Built with 💜 using Next.js 15, React Three Fiber, Tailwind CSS & Google Gemini AI

---

## 🙏 Acknowledgments

- Google Gemini AI for powering the recipe suggestions
- Supabase for the database infrastructure
- React Three Fiber community for 3D graphics support
- Next.js team for the amazing framework

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the author.

---

**⭐ If you find this project helpful, please give it a star!**

![Uploading Screenshot 2026-05-17 174529.png…]()
![Uploading Screenshot 2026-05-17 174529 - Copy - Copy.png…]()
![Uploading Screenshot 2026-05-17 174518 - Copy.png…]()
![Uploading Screenshot 2026-05-17 174513.png…]()

