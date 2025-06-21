# 🍲 Bored Recipes App

A full-stack MERN (MongoDB, Express, React, Node.js) application to browse, search, and filter delicious recipes with nutrition info and ratings.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bored-recipes.git
cd bored-recipes
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 3. Set Up MongoDB

- **Option 1:** [Install MongoDB locally](https://www.mongodb.com/try/download/community)
- **Option 2:** [Create a free MongoDB Atlas cluster](https://www.mongodb.com/cloud/atlas/register)

**Get your MongoDB connection string** (e.g. `mongodb://localhost:27017/recipes` or from Atlas).

---

### 4. Configure Environment Variables

- In the `backend` folder, create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your actual MongoDB URI.

---

### 5. Run the Backend Server

```bash
cd backend
npm start
```

- The backend will run on [http://localhost:3000](http://localhost:3000)

---

### 6. Run the Frontend

```bash
cd ../frontend
npm start
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## 📝 Features

- Paginated recipe browsing
- Powerful search & filter (title, cuisine, rating, time, calories, etc.)
- Nutrition facts and ratings
- Responsive, modern UI

---

## 🛠️ Project Structure

```
bored-recipes/
  backend/      # Express + MongoDB API
  frontend/     # React app
```

---

## 🧑‍💻 Development

- Backend code: `backend/`
- Frontend code: `frontend/src/`
- Main React component: `frontend/src/RecipeTable1.jsx`
- Components: `frontend/src/components/`

---

## 🐞 Troubleshooting

- **MongoDB connection errors:**  
  Double-check your `MONGO_URI` in `.env` and ensure MongoDB is running.
- **Port conflicts:**  
  Change the port in `backend/index.js` or React's config if needed.

---

## 📦 Example `.env` for Backend

```
MONGO_URI=mongodb://localhost:27017/recipes
```

---

## 🙏 Credits

- Built with [React](https://react.dev/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Tailwind CSS](https://tailwindcss.com/)

---

## 📃 License

MIT

---

Enjoy cooking
