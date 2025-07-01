📄 SilentVote – Anonymous Polling Web App

SilentVote is a modern, full-stack web app that allows users to create and participate in anonymous polls with real-time results visualization using charts.

🎯 Built as part of a full-stack assignment using React.js, Node.js, Express, and MongoDB.

🚀 Live Demo
🔗 [View Deployed App](https://silentvotes.vercel.app)

🖥️ Login Credentials (for demo/testing):

Email: demo@silentvote.com

Password: 123456


📦 Tech Stack

Frontend	Backend	Database	Auth	UI/UX

React.js	Node.js	MongoDB	JWT	Tailwind CSS

Chart.js	Express.js	Mongoose	bcrypt	React Toastify

React Router	CORS	dotenv		react-loading-skeleton


✨ Features

🔐 User Authentication

Register, Login, Logout

Forgot password via email token

🗳️ Poll Management

Create polls with custom options

View active polls and vote anonymously

📊 Live Poll Results

Pie chart visualization of voting data

Percentage and vote count display

⚡ User Experience

Shimmer loaders during API fetches

Responsive and clean UI

Toast notifications for all actions

📂 Project Structure

bash```
├── client/           # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/api.js
├── server/           # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── .env          # Mongo URI, JWT secrets, etc.

```

⚙️ Setup Instructions

🔧 Clone the repo
bash```
git clone https://github.com/your-username/silentvotes.git
cd silentvotes
```
⚙️ Backend Setup
bash```
cd server
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET in .env
npm start
```
🌐 Frontend Setup
bash```
cd client
npm install
npm run dev
```
🛡️ Environment Variables (.env)
Create a .env file in /server with:

ini```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

CLIENT_URL=http://localhost:5173

🎥 Walkthrough Video
📹 Watch the demo walkthrough

🙌 Acknowledgments

Thanks to Chart.js

Icons from Heroicons

UI Inspired by Tailwind and React community

🧑‍💻 Author

👋 Mithunkarthik K

💼 Role: Full-stack Developer

📫 Email: k.k.mithunkarthik@gmail.com