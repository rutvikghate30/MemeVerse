# MemeVerse

MemeVerse is a multi-page, highly interactive meme platform where users can explore, upload, and engage with memes. The project is designed to test and enhance frontend development skills, including UI/UX design, animations, state management, performance optimization, API handling, and advanced React techniques.

## 🚀 Live Demo

[Deploy on Vercel or Netlify and insert the link here]

## 📸 Screenshots

(Add relevant screenshots showcasing the UI and functionalities)

## 📌 Features & Functionalities

### 🌟 Homepage (Landing Page)

- Displays trending memes dynamically (Fetched from an API)
- Interactive animations & transitions
- Dark mode toggle

### 🔍 Meme Explorer Page

- Infinite scrolling or pagination
- Meme categories filter (Trending, New, Classic, Random)
- Search functionality with debounced API calls
- Sorting by likes, date, or comments

### 📤 Meme Upload Page

- Upload memes (image/gif format)
- Add funny captions using a text editor
- Option to generate AI-based meme captions
- Preview before uploading

### 📄 Meme Details Page

- Dynamic routing (`/meme/:id`)
- Display meme details, likes, comments, and sharing options
- Comment system (Local storage for now)
- Like buttons with animation and local storage persistence

### 👤 User Profile Page

- Displays user-uploaded memes
- Edit profile info (Name, Bio, Profile Picture)
- View liked memes (saved in local storage or API)

### 🏆 Leaderboard Page

- Top 10 most liked memes
- User rankings based on engagement

### 🎭 404 Page (Easter Egg)

- Fun, meme-based 404 error page for non-existent routes

## 🛠️ Tech Stack

- **Framework:** Next.js/React
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion / GSAP
- **State Management:** Redux Toolkit / Context API
- **Storage:** Local Storage / IndexedDB
- **APIs:** Meme APIs (Imgflip, Meme Generator API)
- **Image Upload:** Cloudinary / Firebase
- **Performance Optimization:** Lighthouse / React Profiler

## 📡 APIs Used

- **Meme APIs:**
  - [Imgflip API](https://imgflip.com/api)
  - [Meme Generator API](https://memegen.link/)
- **Image Upload & Storage APIs:**
  - [ImgBB API](https://api.imgbb.com/)
  - Cloudinary/Firebase for hosting

## 🏆 Skills Demonstrated

✅ UI/UX Design: Aesthetically pleasing and user-friendly layout\
✅ Animations: Smooth transitions, page loads, and UI feedback\
✅ State Management: Efficient use of Redux Toolkit or Context API\
✅ API Handling: Efficient API calls with caching and loading states\
✅ Performance Optimization: Lazy loading, image optimization, code splitting\
✅ DOM Manipulation: Interactive meme editing experience\
✅ Dark Mode: System-based preference and toggle\
✅ Client-side vs Server-side Rendering: Optimized for SEO and performance\
✅ Accessibility & Responsiveness: Mobile-first, accessible for all users


## 📖 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rutvikghate30/MemeVerse.git
   cd MemeVerse
   ```
2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev  # or yarn dev
   ```
4. Open the app in your browser at `http://localhost:3000`

## 🚀 Deployment

- Deploy on **Vercel** or **Netlify**.
- Ensure environment variables are set for APIs.


## 🤝 Contributing

1. Fork the project
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

---

🚀 **Join the MemeVerse and have fun sharing hilarious memes!**



