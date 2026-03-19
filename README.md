<div align="center">
  <h1>🛒 VCart</h1>
  <p><strong>A modern, full-stack e-commerce platform built with the MERN stack</strong></p>

  <p>
    <a href="https://github.com/VividhDesign/VCart/stargazers"><img src="https://img.shields.io/github/stars/VividhDesign/VCart?style=flat-square&color=6c63ff" alt="Stars" /></a>
    <a href="https://github.com/VividhDesign/VCart/network/members"><img src="https://img.shields.io/github/forks/VividhDesign/VCart?style=flat-square&color=6c63ff" alt="Forks" /></a>
    <a href="https://github.com/VividhDesign/VCart/blob/main/LICENSE"><img src="https://img.shields.io/github/license/VividhDesign/VCart?style=flat-square&color=6c63ff" alt="License" /></a>
    <a href="https://github.com/VividhDesign/VCart/issues"><img src="https://img.shields.io/github/issues/VividhDesign/VCart?style=flat-square&color=6c63ff" alt="Issues" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  </p>
</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure sign-up, sign-in, and session management
- 🛍️ **Product Catalog** — Search, filter by category/price/rating, pagination
- 🛒 **Persistent Cart** — Cart state saved to `localStorage`
- 📦 **Full Checkout Flow** — Shipping → Payment Method → Place Order
- 👤 **User Profiles** — Edit name, email, password
- ⭐ **Product Reviews** — Star ratings and comments from verified buyers
- 🛡️ **Admin Dashboard** — Sales stats, manage products/orders/users
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Premium Dark UI** — Glassmorphism navbar, smooth animations, gradient accents

---

## 🚀 Live Demo

> 🚧 Deployment coming soon — stay tuned!

---

## 🗂️ Project Structure

```
VCart/
├── backend/                  # Express + MongoDB API
│   ├── models/               # Mongoose schemas (User, Product, Order)
│   ├── routes/               # REST API routes
│   ├── middleware/           # Auth middleware
│   ├── .env.example          # Environment variable template
│   └── server.js             # App entry point
│
└── frontend/                 # React single-page app
    ├── public/
    └── src/
        ├── components/       # Reusable UI components
        ├── screens/          # Page-level components
        ├── Store.js          # Global state (Context + useReducer)
        └── index.css         # Design system & dark theme
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/VividhDesign/VCart.git
cd VCart
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Install dependencies and start:

```bash
npm install
npm start
```

### 3. Configure the frontend

```bash
cd ../frontend
npm install
npm start
```

The app will open at **http://localhost:3000**.

### 4. Seed the database

With both servers running, open your browser and go to:

```
http://localhost:5000/api/seed
```

This creates 8 sample products and 2 users:

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@example.com   | 123456   |
| User  | user@example.com    | 123456   |

---

## 🌐 Deployment

The project is ready for cloud deployment out of the box.

| Layer    | Platform  | Notes                          |
|----------|-----------|--------------------------------|
| Backend  | [Render](https://render.com) | Free tier, auto-deploy from GitHub |
| Frontend | [Vercel](https://vercel.com) | Free tier, connects to GitHub  |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | Free M0 cluster |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

---

## 📸 Screenshots

> _Screenshots will be added after deployment_

---

## 🤝 Contributing

Contributions are welcome! Whether it's fixing a bug, suggesting a feature, or improving documentation — all PRs are appreciated.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgements

- Inspired by the [MERN Amazona](https://github.com/basir/mern-amazona) project by Basir
- Product images courtesy of [Unsplash](https://unsplash.com)
- Icons by [Font Awesome](https://fontawesome.com)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/VividhDesign">VividhDesign</a></p>
</div>
