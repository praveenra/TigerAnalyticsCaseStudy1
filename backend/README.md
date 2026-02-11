# Backend – Tiger Analytics Case Study

This is the backend service for the Tiger Analytics case study project.  
It provides REST APIs for authentication, image processing, and business logic.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST APIs
- csv-parse for bulk Upload
- json2csv for Export 

---

## 📂 Project Structure
backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── middlewares/
│ └── utils/
├── config/
├── package.json
├── .env.example
└── README.md

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/praveenra/TigerAnalyticsCaseStudy1.git
cd TigerAnalyticsCaseStudy1/backend

###  2️⃣Install Dependencies
npm install

### 3️⃣ Environment Variables
NODE_ENV=development
PORT=3000
MONGO_URI=monogdbURI
JWT_ACCESS_SECRET=YOUR_JWT_ACCESS_SECRET
JWT_ACCESS_EXPIRES_IN=5h
JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d
SECRET_NAME=YOUR_SECRET_NAME

4️⃣ Run the Server
npm run dev

Server will start at: http://localhost:3000