# 📚 BookBuddy – Your Personal Book Library & Chat Platform

BookBuddy is a comprehensive MERN (MongoDB, Express, React, Node.js) stack web application crafted for avid readers and authors alike. It offers a seamless experience for managing personal book collections, sharing insightful reviews, and connecting with a vibrant community through real-time chat.

-----

## 🚀 Features

### User & Profile Management

  * **Secure Authentication:** Enjoy peace of mind with secure signup and login, featuring hashed passwords and JWT-based session management. Choose your role as either a **Reader** or **Author**.
  * **Personalized Profiles:** Customize your presence by uploading and displaying profile pictures, alongside viewing and updating your personal information.

### Dashboard & Book Management

  * **Intuitive Dashboard:** Navigate through an engaging, visually-rich UI. Easily discover books using categories and robust search filters (by author, genre, or title).
  * **Role-Specific Experiences:** Dashboards are tailored to your chosen role, providing relevant functionalities whether you're a Reader or an Author.

### Real-Time Communication

  * **Integrated Chat:** Connect instantly with other users through one-on-one messaging, similar to WhatsApp. See who's online, track chat history, and view timestamps, all powered by **Socket.IO**.

### Additional Features

  * **Contact Form:** Directly send complaints or queries to the admin at `anshvashisht.2003@gmail.com`.
  * **Welcome Animation:** Be greeted by an engaging BookBuddy logo animation splash screen that smoothly transitions you to the dashboard.

-----

## 🏗️ Tech Stack

### Frontend

  * **React.js:** For building a dynamic and responsive user interface.
  * **Tailwind CSS + DaisyUI:** For rapid and efficient styling.
  * **Zustand:** For streamlined global state management.
  * **Axios:** For making HTTP requests.

### Backend

  * **Node.js + Express.js:** For a robust and scalable server-side.
  * **MongoDB + Mongoose:** For flexible NoSQL database management.
  * **Multer:** For handling file uploads, specifically profile pictures.
  * **Socket.IO:** For enabling real-time, bidirectional communication in the chat.
  * **Nodemailer:** For reliable email support via the contact form.
  * **JSON Web Tokens (JWT):** For secure user authentication and authorization.

-----

## 📁 Project Structure

```
BookBuddy/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/         # Reusable React components
│ │ ├── pages/              # Individual page components
│ │ ├── assets/             # Static assets like images
│ │ ├── App.js              # Main application component
│ │ └── main.jsx            # Entry point for the React app
│ └── tailwind.config.js    # Tailwind CSS configuration
├── backend/
│ ├── controllers/          # Business logic for routes
│ ├── models/               # MongoDB schemas and models
│ ├── routes/               # API routes
│ ├── uploads/              # Directory for uploaded files (e.g., profile pictures)
│ ├── server.js             # Main backend server file
│ └── config/               # Configuration files (e.g., database connection)
├── .env                    # Environment variables (for backend)
└── README.md               # Project README file
```

-----

## 🔐 Environment Variables (`.env`)

To get started, create a `.env` file in the `backend/` folder and populate it with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=anshvashisht.2003@gmail.com
EMAIL_PASS=generated_app_password
```

-----

## 🛠️ Installation

Follow these steps to set up BookBuddy on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/bookbuddy.git
    cd bookbuddy
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    npm start
    ```

3.  **Frontend Setup:**

    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

-----

## 💬 Socket.IO Integration

The real-time chat functionality is powered by **Socket.IO**, ensuring instant messaging between users. The Socket.IO setup is managed in `server.js` on the backend and seamlessly integrated into the frontend using React Context for efficient state management.

-----

## 🔎 Search & Filters

Discover your next read with powerful search and filter options. Books can be easily filtered by:

  * **Author Name**
  * **Genre**
  * **Title**

-----

## 👥 User Roles

BookBuddy supports two distinct user roles, each with specific permissions and functionalities:

  * **Reader:**

      * View books and explore various genres.
      * Engage in real-time chat with other users.

  * **Author:**

      * Upload and share their own books with the community.
      * Manage reviews for their published works.

-----

## 🧪 Testing

Currently, basic testing is performed manually. Future enhancements will include:

  * **Unit Testing:** Utilizing frameworks like Jest and React Testing Library.
  * **API Testing:** Employing tools such as Postman and Supertest for robust API validation.

-----

## 📧 Contact

For any queries, feedback, or potential contributions, feel free to reach out:

  * **Email:** anshvashisht.2003@gmail.com
  * **GitHub:** [github.com/ansh-vashisht2003](https://www.google.com/search?q=https://github.com/ansh-vashisht2003)

-----

## 📄 License

This project is open-source and distributed under the **MIT License**.

-----

## 🌟 Show Your Support

If you found BookBuddy helpful or enjoyable, please consider giving it a ⭐ on GitHub\! Your support is greatly appreciated.
