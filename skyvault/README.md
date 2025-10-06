# 🌩️ SkyVault – Secure & Seamless Cloud File Storage System

SkyVault is a cloud-based file storage solution designed for secure, efficient, and user-friendly file and folder management. Built with a full-stack architecture, it supports both user and admin roles with differentiated access controls and features. It is ideal for individuals or small teams looking for a self-hosted storage system.

---

## 🚀 Features

### 🔐 User Module
- **User Dashboard**: Overview of folders and recent file activities.
- **Manage Folders**: Create, rename, or delete folders.
- **Manage Files**: Upload, download, or delete files within folders.
- **Change Password**: Update user credentials securely.
- **Send Feedback**: Communicate feedback directly through the interface.
- **About Project**: View app information and version.

### 🛠 Admin Module
- **Admin Dashboard**: Overview of platform usage and system health.
- **Manage User Profiles**: View, edit, or remove registered users.
- **View All Folders/Files**: Monitor all stored content system-wide.
- **Read Feedback**: Access and respond to user-submitted feedback.
- **About Project**: View admin-level details.

---

## 🏗️ Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| **Frontend** | HTML, CSS, ReactJs    |
| **Backend**  | Node.js, Express.js      |
| **Database** | MongoDB                  |
| **Cloud**    | AWS S3 (File Storage)    |
| **Authentication** | JWT (JSON Web Tokens) |

---

## 🛡️ Security

- Secrets are stored in `.env` (excluded from version control)
- AWS credentials are never pushed to GitHub
- Role-based access control (RBAC)
- Input validation and sanitization

---

### Project Overview

## Control Flow Diagram
<img width="860" height="1000" alt="image" src="https://github.com/user-attachments/assets/be5b14b5-b031-4ed7-9c2a-f5ca16ca168c" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/364ae9c8-545f-497e-a014-3ea13cf26d71" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/bcbcd880-9dac-4485-bb30-edc93e1a85ae" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/74fa9ffe-95a4-4fa8-b5ae-ede947d0d2e2" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/a8c09646-6f04-46dc-b2a9-ff223e926b37" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/21f88c1a-3c5e-4068-9c73-cb4234f26489" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/f17a50d3-f4b4-479b-b114-f932c09a12f3" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/d4f2b7eb-b28c-4572-ad50-b553a81670bb" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/5d1315b6-45f3-4152-bd31-60dec70a5b4f" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/3440c1dc-7983-4b0c-8d50-ccdcf09fe48a" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/224da63a-928b-4d4b-aaf0-8f38a7bf2ff9" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/097f44ef-84cd-4bed-afee-09ed59a4cbdc" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/345e44da-d948-46c2-aa8b-4d3426aa670e" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/038c83a1-e6bc-4748-abde-460d41dd1cf6" /><br><br>
<img width="860" height="510" alt="image" src="https://github.com/user-attachments/assets/3129c224-3faf-4c1e-9ed7-f9d053527f07" /><br><br>

## ⚙️ How to Use SkyVault on Another System

Follow these steps to clone, configure, and run SkyVault on a new machine.

---

### 🧾 1. Prerequisites

Ensure the following are installed:

- [Node.js (v14+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- [AWS Account](https://aws.amazon.com/) (for S3 integration)

---

### 📦 2. Clone the Repository

git clone https://github.com/Dartpixel/skyvault.git

cd skyvault

cd backend

npm install

cd frontend

npm install

### Create your .env file in /backend and set environment variables

touch .env

PORT=5000

MONGODB_URI=your_mongo_uri

JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_key

AWS_SECRET_ACCESS_KEY=your_aws_secret

AWS_REGION=your_aws_region

S3_BUCKET_NAME=your_bucket_name

### Now run these command for frontned and backend
npm start and npm run dev

## 📬 Feedback and Contribution

We welcome contributions and suggestions. Feel free to:

- 📌 [Submit a pull request](https://github.com/Dartpixel/skyvault/pulls)
- 🐞 [Create an issue](https://github.com/Dartpixel/skyvault/issues)
- 💬 Share feedback directly through the app’s feedback form

Your input helps us improve SkyVault continuously!

---

## 🧑‍💻 Author

**Kartik Sharma**  
Developer | Tech Enthusiast
📧 Reach me on [LinkedIn](https://www.linkedin.com/in/kartiksharma2004/)

---













