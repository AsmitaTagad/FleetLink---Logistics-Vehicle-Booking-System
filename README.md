# FleetLink - Logistics Vehicle Booking System

FleetLink is a web-based logistics vehicle booking system where admins can manage vehicles and users can search, book, and track vehicle bookings. The application provides an attractive dashboard, vehicle management, booking tracking, and pricing calculation based on distance and rate.

---

## Technologies Used

**Frontend:**
- React.js with [Vite](https://vitejs.dev/) for fast development and HMR
- Tailwind CSS for styling
- React Router for navigation
- Redux for state management
- Axios for API requests
- Lucide-react icons

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose for data modeling
- JWT for authentication
- dotenv for environment configuration

**Other Tools & Libraries:**
- React Toastify for notifications
- Date handling with JavaScript `Date` objects
- Docker & Kubernetes (if applicable for deployment)
- Git for version control

---

## Features

**Admin:**
- Add, update, and delete vehicles
- View all bookings and upcoming schedules
- Dashboard with analytics and highlights

**User:**
- Search vehicles by capacity, source, destination, and date
- Book vehicles with real-time availability check
- Track upcoming bookings and booking history
- Pricing calculation based on distance and vehicle rate

**General:**
- Responsive and attractive UI
- Proper validation and notifications
- Booking conflict prevention
- Distance estimation for fare calculation

---

## Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/fleetlink.git
cd fleetlink
