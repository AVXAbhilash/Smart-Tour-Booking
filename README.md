    # 🌍 BookingBuddy | Full-Stack MERN Tour Management System

[](https://opensource.org/licenses/MIT)
[](https://reactjs.org/)
[](https://nodejs.org/)
[](https://www.mongodb.com/)
[](https://tailwindcss.com/)

**BookingBuddy** is a premium, end-to-end travel booking platform designed for seamless user experiences and robust administrative control. Built with the **MERN Stack**, it features an immersive video-hero landing page, secure JWT authentication, and a comprehensive Admin ERP for managing inventory, users, and financial transactions.

-----

## ✨ Key Features

### 👤 User Interface

  * **Immersive Hero Experience:** High-definition video background with a glassmorphism search interface.
  * **Dynamic Discovery:** Real-time filtering by category (Mountains, Beach, City, Adventure).
  * **Secure Checkout:** Integrated booking flow with simulated payment card metadata storage.
  * **User Dashboard:** Personal booking history, profile management, and live refund tracking.
  * **Password Recovery:** Full "Forgot Password" flow with secure token-based email simulation.

### 🛡️ Admin Suite (ERP)

  * **Analytics Dashboard:** Real-time stats for Total Revenue, Active Bookings, and User growth.
  * **Inventory Management:** Full CRUD operations for tour packages (Titles, Images, Pricing, Categories).
  * **User Control:** Authority to manage user roles (Admin vs. User) and account deletions.
  * **Financial Processing:** Modern UI for processing pending refunds and managing customer reviews.

-----

## 🚀 Tech Stack

**Frontend:** \* React.js (Hooks, Context, Router)

  * Tailwind CSS (Modern UI/UX)
  * Lucide React (Iconography)
  * Axios (API communication)

**Backend:**

  * Node.js & Express.js
  * MongoDB & Mongoose (ODM)
  * JSON Web Tokens (JWT) for Authentication
  * Bcrypt.js (Password Hashing)
  * Multer (Image Uploads)

-----

## 🛠️ Installation & Setup

### 1\. Clone the repository

```bash
git clone https://github.com/yourusername/bookingbuddy.git
cd bookingbuddy
```

### 2\. Backend Setup

Create a `.env` file in the `/backend` directory:

```env
PORT = 5200
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
```

Install dependencies and start the server:

```bash
cd backend
npm install
npm run dev
```

### 3\. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

-----

## 📸 Screenshots

| Dashboard Overview |
![alt text](<Screenshot 2026-04-12 191358.png>)
![alt text](<Screenshot 2026-04-12 184311.png>)

| Manage Tours |
![alt text](<Screenshot 2026-04-12 185956.png>)
| Booking Details |
![alt text](<Screenshot 2026-04-12 184336.png>)

-----

## 📁 Project Structure

```text
├── backend
│   ├── controllers/   # Business logic (Tours, Users, Bookings, Reviews)
│   ├── models/        # Mongoose Schemas
│   ├── routes/        # Express API Endpoints
│   ├── middleware/    # Auth & Error handling
│   └── server.js      # Entry point
├── frontend
│   ├── src
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Admin, User, and Auth views
│   │   ├── App.jsx     # Routing & Layout logic
│   │   └── main.jsx    # Root entry
```

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

**Developed with ❤️ by Abhilash Mohanta**