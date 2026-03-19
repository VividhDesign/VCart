# Deployment Guide

This guide walks you through deploying VCart to the internet for free using **Render** (backend) and **Vercel** (frontend), with **MongoDB Atlas** as the database.

> Estimated time: ~15 minutes

---

## Prerequisites

- GitHub account (forked/cloned this repo)
- [MongoDB Atlas](https://cloud.mongodb.com) account with a cluster ready
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account

---

## Step 1 — MongoDB Atlas Setup

1. Log in to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster if you don't have one
3. Go to **Database Access** → **Add Database User**:
   - Username: anything (e.g. `vcart_user`)
   - Password: a strong password — **save this**
4. Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Connect your application** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   ```

---

## Step 2 — Deploy the Backend on Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** → **Web Service**
3. Connect your **VCart** repository
4. Configure:
   - **Name:** `vcart-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add **Environment Variables**:

   | Key           | Value                             |
   |---------------|-----------------------------------|
   | `MONGODB_URI` | Your Atlas connection string      |
   | `JWT_SECRET`  | A random 32+ character string     |
   | `NODE_ENV`    | `production`                      |

6. Click **Create Web Service** — Render will deploy and give you a URL like:
   ```
   https://vcart-api.onrender.com
   ```
   **Save this URL** — you'll need it for the frontend.

7. Once deployed, seed your database by visiting:
   ```
   https://vcart-api.onrender.com/api/seed
   ```

---

## Step 3 — Deploy the Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import your **VCart** repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Create React App`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add **Environment Variable**:

   | Key                 | Value                               |
   |---------------------|-------------------------------------|
   | `REACT_APP_API_URL` | `https://vcart-api.onrender.com`    |

5. Click **Deploy**

Your app will be live at a URL like `https://vcart.vercel.app`.

---

## Step 4 — Update CORS (Important!)

After deployment, add your Vercel URL to the backend's CORS allowed origins.

Open `backend/server.js` and add your Vercel URL to the `origin` array:

```js
origin: [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://vcart.vercel.app',  // <-- add this
],
```

Push this change to GitHub — Render will automatically redeploy.

---

## Admin Login

After seeding, use these credentials to access the admin dashboard:

| Field    | Value               |
|----------|---------------------|
| Email    | admin@example.com   |
| Password | 123456              |

> ⚠️ Change the admin password after first login in production.

---

## Troubleshooting

**Backend returns 500 errors after deplying?**
→ Double-check your `MONGODB_URI` environment variable in Render. Make sure Atlas Network Access allows `0.0.0.0/0`.

**Frontend can't reach the API?**
→ Make sure `REACT_APP_API_URL` is set correctly in Vercel and matches your Render backend URL exactly (no trailing slash).

**Render service goes to sleep?**
→ On Render's free tier, services spin down after 15 minutes of inactivity. The first request after inactivity may take ~30 seconds. Upgrade to a paid plan or use a cron job to ping the server every 10 minutes.
