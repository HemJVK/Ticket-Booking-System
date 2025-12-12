# Modex Ticket Booking System

## Overview
This is a high-concurrency Ticket/Doctor Appointment Booking System built with Node.js, Express, PostgreSQL, React, and TypeScript.
It features a layered architecture, database transactions with row-level locking to prevent overbooking, and a React frontend with Context API and direct DOM manipulation.

## Tech Stack
-   **Backend**: Node.js, Express, PostgreSQL, TypeScript
-   **Frontend**: React, TypeScript, Tailwind CSS, Vite
-   **Database**: PostgreSQL

## Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL

### Backend Setup
1.  Navigate to `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env` (defaults are provided in `src/config/db.ts`):
    ```
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=ticket_db
    DB_HOST=localhost
    DB_PORT=5432
    PORT=3000
    ```
4.  Start the server:
    ```bash
    npm start
    # or for development
    npm run dev
    ```
    The server will initialize the database tables on startup.

### Frontend Setup
1.  Navigate to `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## API Documentation

### Shows
-   `GET /api/shows` - Get all shows
-   `POST /api/shows` - Create a new show
    -   Body: `{ "name": "Show Name", "start_time": "ISO Date", "total_seats": 50 }`
-   `GET /api/shows/:id` - Get specific show details

### Bookings
-   `POST /api/bookings` - Book a seat
    -   Body: `{ "show_id": 1, "user_id": 123, "seat_number": 5 }`
-   `GET /api/bookings/show/:showId` - Get all bookings for a show

## System Design & Scalability
(See below for the written component)

### Concurrency Handling
We use PostgreSQL **Transactions** and **Row-Level Locking (`FOR UPDATE`)** to ensure data consistency.
When a user attempts to book a seat:
1.  A transaction is started (`BEGIN`).
2.  We lock the parent Show row (`SELECT * FROM shows WHERE id = $1 FOR UPDATE`). This serializes booking attempts for the same show.
3.  We check if the specific seat is already booked in the `bookings` table.
4.  If free, we insert the booking and `COMMIT`.
5.  If taken, we `ROLLBACK`.

### Scalability Considerations
-   **Database**:
    -   **Read Replicas**: Separate read (GET /shows) and write (POST /bookings) traffic.
    -   **Sharding**: Shard by `show_id` or `date` to distribute load across multiple nodes.
-   **Caching**: Redis can be used to cache `GET /shows` and seat availability maps (invalidated on new bookings).
-   **Message Queues**: Use RabbitMQ/Kafka for booking processing to decouple the HTTP response from the DB write, though for immediate feedback ("seat locked"), a synchronous check or distributed lock (Redlock) is preferred.
