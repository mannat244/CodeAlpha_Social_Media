# 🔗 Synq — A Fast, Modern Social Media App Built with Next.js

![image](https://github.com/user-attachments/assets/17bf14b6-69f1-412d-b564-d8f9634bfefd)


**Synq** is a blazing fast, full-stack social media platform built using the latest **Next.js App Router**, **MongoDB**, and **Tailwind CSS**. It offers a sleek and responsive experience where users can connect, follow, post, like, and comment — all in real-time.

---

## 🎓 Built with CodeAlpha Internship

This project was developed as part of an **internship at [CodeAlpha](https://codealpha.tech)** — a platform empowering students and developers to grow their real-world skills through hands-on experience.

> 🛠️ This internship experience helped build industry-ready knowledge using modern web technologies like **Next.js**, **MongoDB**, and **Tailwind CSS**.

---

## 🚀 Why Synq?

Unlike bloated social apps, **Synq is optimized for speed and simplicity**, especially during local development.

- ⚡ Ultra-fast locally thanks to **Next.js 15 + Turbopack**
- 🔥 Modern app architecture using **React Server Components**
- 🗂️ Clean folder structure via **App Router**
- 🍃 MongoDB for scalable document storage
- 💾 Iron Session for secure cookie-based auth
- 🌐 Fully responsive with **Tailwind CSS**
- 🎨 Modern gradient-based UI with backdrop blur effects

---

## ✨ Features

### Core Functionality
- ✅ **Authentication** - Sign up & login with secure session management
- 📝 **Post Management** - Create, edit, and delete posts with rich content
- ❤️ **Social Interactions** - Like and comment on posts with real-time updates
- 👥 **User Connections** - Follow/unfollow other users
- 🔍 **Profile System** - View profiles, user stats, and post history
- 💬 **Comment System** - post comments 

### Technical Features
- 📄 Real-time data fetching using server actions
- 🧠 Smart serialization for fast server-to-client data sharing
- 🎭 Modern UI with gradient backgrounds and smooth animations
- 📱 Fully responsive design optimized for all devices
- 🔒 Secure cookie-based authentication
- ⚡ Optimized performance with Next.js App Router

---

## 🎨 Design Highlights

Synq features a modern, premium design system:

- **Gradient Backgrounds** - Beautiful slate-based gradients with floating blur elements
- **Glassmorphism Effects** - Backdrop blur and transparency for depth
- **Interactive Elements** - Smooth hover animations and micro-interactions
- **Consistent Iconography** - Mix of Lucide React icons and contextual emojis
- **Premium Typography** - Gradient text effects and proper hierarchy
- **Responsive Layout** - Optimized for desktop, tablet, and mobile

---

## ⚙️ Stack

| Layer         | Technology              | Purpose                    |
|---------------|-------------------------|----------------------------|
| **Frontend**  | Next.js (App Router)    | React framework & routing  |
| **Styling**   | Tailwind CSS            | Utility-first CSS          |
| **Backend**   | Node.js + Next.js API   | Server-side logic          |
| **Database**  | MongoDB with Mongoose   | Document storage           |
| **Auth**      | Iron Session            | Secure session management |
| **Icons**     | Lucide React            | Modern icon library        |
| **Deployment**| Vercel (optional)       | Hosting platform           |

---

## 🛠️ Local Development

Synq is **highly optimized for local development**. You'll notice significantly faster compile times and route loads with **Turbopack**.

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/synq.git
cd synq
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
SESSION_PASSWORD=your_strong_password_32_chars_min
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

> ⚡ The app will be available at `http://localhost:3000`

You'll be impressed by how snappy **Synq** feels — even with a growing user base and post activity.

---

## 🧪 Production Build

To test production optimizations:

```bash
npm run build
npm start
```

For static export (if applicable):
```bash
npm run export
```

---

## 📂 Project Structure

```
synq/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Home/Feed page
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   └── api/               # API routes
│       ├── posts/         # Post-related APIs
│       ├── auth/          # Auth APIs
│       └── users/         # User-related APIs
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
│   ├── mongodb.js        # Database connection
│   ├── auth.js           # Auth configuration
│   └── utils.js          # Helper functions
├── models/               # MongoDB models
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── styles/               # Global styles
├── public/               # Static assets
└── utils/                # Utility functions
```

---

## 🎯 Key Components

### Authentication System
- Session-based authentication with Iron Session
- Secure password hashing
- Protected routes and middleware

### Feed System
- Real-time post creation and updates
- Infinite scroll (optional)
- Like and comment functionality

### Profile System
- User profiles with stats
- Follow/following relationships
- Personal post history

### UI Components
- Modern gradient-based design
- Responsive layout system
- Interactive animations

---

## 🧼 Best Practices & Notes

- ✅ All `ObjectId` values from MongoDB are safely serialized using `.toString()` before reaching client components
- 🧠 Uses server actions for fetching profile/session data — no unnecessary API overhead
- 🔐 Only plain objects are passed to client components, fixing serialization issues common in Server Components
- 🎨 Consistent design system with Tailwind utility classes
- 📱 Mobile-first responsive design approach
- ⚡ Optimized for performance with proper caching strategies

---

## 🌍 Roadmap

### (Current)
- [x] User authentication
- [x] Post creation and management
- [x] Like and comment system
- [x] Follow/unfollow functionality
- [x] Modern UI design

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Credits

**Built with 💙 by Mannat Trivedi**  
*Made during an internship with [CodeAlpha](https://codealpha.tech)*

### Acknowledgments
- CodeAlpha for the internship opportunity
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for reliable data storage
- Lucide React for beautiful icons

---

## 📞 Support

If you have any questions or need help:

- 📧 Email: mannateducation@gmail.com
---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**


*Built with Next.js • MongoDB • Tailwind CSS*

</div>
