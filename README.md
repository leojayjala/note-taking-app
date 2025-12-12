# MyPersonalNotes - Personal Note Taking App

## 👥 Group Members
- [Leo Jay L. Jala]
- [Dixter James mattheo R. Naorbe]
- [Robert Lourenz Alompon]

## 🚀 Live Demo
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: MySQL via phpMyAdmin (http://localhost/phpmyadmin)

## 🏗️ Tech Stack
- **Frontend:** Next.js 14 with Tailwind CSS
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MySQL with XAMPP
- **API Communication:** Axios with interceptors

## ✨ Features
✅ User Registration & Login with JWT Tokens  
✅ Create, Read, Delete Notes (Full CRUD via API)  
✅ User-Specific Data Privacy  
✅ Responsive UI with Tailwind CSS  
✅ Secure Password Hashing (bcrypt)  
✅ RESTful API with Proper Error Handling  

## 📊 Database Schema
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);