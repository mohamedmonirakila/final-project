# Glow Clinic Application Setup Guide

## Prerequisites

Ensure you have the following software installed:

- Node.js
- PostgreSQL

## Setup Steps

1. **Install PostgreSQL:**

   - Download and install PostgreSQL from [PostgreSQL Downloads](https://www.postgresql.org/download/).
   - Follow the installation instructions for your operating system.

2. **Initialize PostgreSQL:**

   - Open a terminal/command prompt and run the following commands:
     ```bash
     psql -U postgres
     ```
   - Create a new database for your application:
     ```sql
     CREATE DATABASE glow_clinic;
     ```

3. **Run the Application:**
   - Navigate to your project directory and run the application:
     ```bash
     npm run electron
     ```

## Notes

- Ensure PostgreSQL is running before launching the application.

# DENTAL CLINIC APPLICATION

#### Video Demo: [YouTube Video](https://youtu.be/3mYMhGFpyl0)

#### Description:

This project is a comprehensive management application designed to streamline the operations of a dental clinic. The system primarily focuses on patient management, visit tracking, payment recording, and doctor salary calculations. The application allows clinic staff to efficiently manage patient records, including personal details and visit histories.

**Key Features:**

- **Patient Record Management:** Store and manage detailed patient information, including personal data and medical history. Track each patient's visits, including the reason for the visit, treatments provided, and associated costs.
- **Visit and Payment Tracking:** Record the cost of each visit and any payments made by the patient. Automatically calculate the total amount due for each patient, factoring in previous payments and outstanding balances.
- **Doctor Salary Calculation:** Track payments made to doctors for each visit. Calculate monthly salaries based on the total payments received by each doctor during the month.
- **User-Friendly Interface:** The application offers an intuitive interface that allows users to easily navigate through patient records, visit logs, and payment histories.

**Technologies Used:**

- **Backend:** Node.js, Express.js, PostgreSQL
- **Frontend:** React.js, Bootstrap
- **Security:** bcrypt for password hashing, session management for user authentication

This system aims to simplify the administrative tasks of a dental clinic, ensuring accurate record-keeping, efficient payment management, and timely salary calculations for doctors.
