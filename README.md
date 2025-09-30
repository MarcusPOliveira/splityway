# Splityway 🍕💰

A modern and intuitive web application to split bills among friends fairly and practically.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 🎯 About the Project

Splityway is a complete solution for splitting bills at restaurants, bars, or any other establishment. The application allows you to create groups, add consumed items, select who participated in each item, and automatically calculate how much each person should pay.

### Key Features

- ✅ **Group Creation**: Define location and number of participants
- 📝 **Order Entry**: Add items with unit price and quantity
- 👥 **Participant Selection**: Choose who consumed each item
- 💵 **Waiter Tip**: Add tip by percentage or fixed amount
- 📊 **Automatic Calculation**: Fair split based on each person's consumption
- 📱 **Responsive Design**: Interface optimized for mobile and desktop
- 🎨 **Themes**: Light and dark mode support
- 📦 **Multiple Groups**: Manage multiple groups simultaneously
- 📜 **History**: Access completed groups anytime
- 🔄 **Local Persistence**: Data saved in browser (localStorage)

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Space Mono](https://fonts.google.com/specimen/Space+Mono)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Backend/DB**: [Firebase](https://firebase.google.com/) (Analytics)

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn or pnpm

### Steps

1. Clone the repository:

```bash
git clone https://github.com/MarcusPOliveira/splityway.git
cd splityway
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables (optional - for Firebase Analytics):

```bash
cp .env.example .env.local
```

Add your Firebase credentials to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the project in development mode:

```bash
npm run dev
```

5. Access http://localhost:3000

## 🏗️ Production Build

```bash
npm run build
npm start
```

## 📖 How to Use

### 1. Create a Group

- Access the home page
- Enter the location name (e.g., "Joe's Bar")
- Select the number of people
- Click "Create Group"

### 2. Add Items

- Enter the consumed item name
- Enter quantity and unit price
- Select the participants who consumed the item
- View real-time summary
- Click "Add Item"

### 3. Add Tip (Optional)

- Click "Add Waiter Tip"
- Choose between percentage or fixed amount
- Select who will pay (default: everyone)
- Confirm

### 4. Finish and View Results

- Click "Finish"
- See how much each person should pay
- Share the results
- Access history when needed

## 📁 Project Structure

```
splityway/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── orders/              # Orders page
│   ├── results/             # Results page
│   ├── history/             # Groups history
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── create-group-form.tsx
│   ├── order-form.tsx
│   ├── results-summary.tsx
│   ├── groups-history.tsx
│   ├── tip-dialog.tsx
│   ├── theme-switcher.tsx
│   └── ...
├── lib/                     # Utilities
│   ├── utils.ts
│   └── firebase.ts
├── public/                  # Static files
└── tailwind.config.ts       # Tailwind configuration
```

## 🎨 Themes and Customization

The project uses a custom theme with `oklch` color palette:
- **Primary**: Purple/Violet
- **Secondary**: Yellow/Amber
- **Background**: Neutral with dark mode support
- **Font**: Space Mono (monospace)

To customize, edit `app/globals.css` and `tailwind.config.ts`.

## 🤝 How to Contribute

Contributions are very welcome! Follow the steps below:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code standards (TypeScript + ESLint)
- Write descriptive commit messages
- Test your changes before submitting
- Document new features
- Keep code clean and well-commented

## 📝 Roadmap

- [ ] User authentication
- [ ] Real-time sync between devices
- [ ] Export results to PDF
- [ ] Multiple currency support
- [ ] PWA (Progressive Web App)
- [ ] Custom split by weight/percentage
- [ ] Push notifications
- [ ] Payment app integration

## 🐛 Bugs and Suggestions

Found a bug or have a suggestion? Open an [issue](https://github.com/MarcusPOliveira/splityway/issues).

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

**Marcus Paulo Oliveira**

- GitHub: [@MarcusPOliveira](https://github.com/MarcusPOliveira)
- LinkedIn: [Marcus Paulo Oliveira](https://linkedin.com/in/marcuspaulooliveira)

## 🙏 Acknowledgments

- [shadcn](https://twitter.com/shadcn) for the amazing UI components
- Open source community

---

⭐ If this project was helpful to you, consider giving it a star!
