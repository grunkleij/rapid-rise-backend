# Rapid Raise Backend API

A robust, secure backend REST API built with NestJS and PostgreSQL. This project features a complete relational database architecture, secure file management, and industry-standard JWT authentication.

## Features

* **Advanced Authentication:** Implements a Double-Token JWT architecture (Access & Refresh tokens) with bcrypt password hashing and secure token revocation (Logout).
* **Relational Database:** Utilizes TypeORM and PostgreSQL with strict `OneToMany` and `ManyToOne` foreign key constraints and cascading deletes.
* **User-Scoped Data (IDOR Protection):** Task and File CRUD operations are strictly scoped to the authenticated user, preventing cross-user data manipulation.
* **Secure File Management:** Multipart form data uploading via Multer, with strict file size/type validation and secure streaming downloads.
* **OpenAPI Documentation:** Auto-generated Swagger UI integration for seamless API testing.

## Tech Stack

* **Framework:** NestJS (Node.js / TypeScript)
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Authentication:** Passport.js, JSON Web Tokens (JWT), bcrypt
* **File Uploads:** Multer

## Prerequisites

Before running this project, ensure you have the following installed:
* Node.js (v16 or higher)
* PostgreSQL (Running locally or via Docker)

## Environment Setup

Create a `.env` file in the root directory of the project and add the following variables. 

> **Note for Windows Users:** Ensure your `DB_PASSWORD` does not contain quotes in the `.env` file, as the application explicitly casts it to a string to satisfy Windows PostgreSQL TCP/IP requirements.

```env
# --- Application ---
PORT=3000

# --- Database (PostgreSQL) ---
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=rapid_raise_db

# --- Authentication (JWT Secrets) ---
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key