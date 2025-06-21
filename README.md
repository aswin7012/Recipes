## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aezakmi7012/bored.git
cd bored
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
node index.js
```

- The backend will run on [http://localhost:3000](http://localhost:3000)

---

### 6. Run the Frontend

```bash
cd ../frontend
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## 📝 Features

- Paginated recipe browsing
- Powerful search & filter (title, cuisine, rating, time, calories, etc.)
- Nutrition facts and ratings
- Responsive, modern UI

---

