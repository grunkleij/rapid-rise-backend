# Rapid Raise Backend API

A robust, enterprise-grade REST API built with NestJS. This application provides secure user authentication, Task management (CRUD), and a highly optimized, database-backed file sharing system.

## Tech Stack

* **Framework:** NestJS (Node.js / TypeScript)
* **Database:** PostgreSQL with TypeORM
* **Authentication:** Passport.js with JWT (JSON Web Tokens)
* **File Handling:** Multer (Disk Storage) with native Node.js Streams
* **API Documentation:** Swagger / OpenAPI

## Core Features

* **Secure Authentication:** JWT-based route protection.
* **Task Management:** Full CRUD operations for task entities.
* **Advanced File Management:**
  * **Secure Uploads:** Files are physically stored using cryptographically secure UUIDs to prevent malicious overwrites and directory traversal attacks.
  * **Database-Backed:** File metadata (original name, MIME type, size) is tracked in PostgreSQL.
  * **Optimized Downloads:** The download endpoint utilizes `StreamableFile` to pipe data directly to the client, ensuring the server's RAM is never overwhelmed by large files.
  * **UX-Friendly:** The API accepts a clean database ID (`GET /files/download/:id`) and dynamically restores the file's original, readable name via the `Content-Disposition` header upon download.

## Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

## Environment Setup

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables and update them with your local database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=rapid_raise_db

# Security
JWT_SECRET=your_super_secret_jwt_key