# Bazar Dor | বাজার দর

**Bazar Dor** is a web application that helps users explore daily essential product prices, compare historical prices, and check market-wise price ranges to plan their shopping more effectively.

## Live Demo

- **Live Website:** Add your deployed website URL here
- **GitHub Repository:** https://github.com/ProgrammingHero1/B14-A7-Bazar-Dor

## Project Overview

Bazar Dor provides a simple and user-friendly platform for checking the prices of everyday essentials in Bangladesh. Users can browse product categories, view current prices, compare prices with previous periods, and explore market-wise minimum and maximum prices.

The application also includes user authentication, allowing users to create an account and sign in securely.

## Features

- **Homepage:** Browse available products and categories.
- **Product Categories:** Explore products by category.
- **Current Prices:** View the latest available product prices.
- **Price History:** Compare today's prices with yesterday's, last week's, and last month's prices.
- **Market-wise Prices:** Check minimum and maximum prices across different markets when data is available.
- **Price Changes:** View price increases or decreases based on the API data.
- **User Authentication:** Sign up, sign in, and sign out using Better Auth.
- **Responsive Design:** Use the website on desktop, tablet, and mobile devices.
- **Bangla Interface:** View product information in Bengali.

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- Better Auth
- MongoDB
- Programming Hero Bazar Dor API

## API

This project uses the Programming Hero Bazar Dor API to retrieve product and category information.

**Base URL:**

`https://openapi.programming-hero.com/api/bazardor`

**Endpoints:**

- `/categories` — Retrieves product categories.
- `/products` — Retrieves product information.

The application uses Next.js data caching with a revalidation period of 60 seconds for these requests.

## Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB access for authentication

### 1. Clone the Repository

```bash
git clone https://github.com/ProgrammingHero1/B14-A7-Bazar-Dor.git
```

### 2. Navigate to the Project Directory

```bash
cd B14-A7-Bazar-Dor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory and configure the environment variables required by your Better Auth and MongoDB setup.

Example:

```env
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_MONGODB_URI=your_mongodb_connection_string
```

Replace the example values with your own configuration. Never commit real secrets or database credentials to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── category/
│   │   └── [slug]/
│   │       └── page.js
│   ├── product/
│   │   └── [slug]/
│   │       └── page.js
│   ├── sign-in/
│   ├── sign-up/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── header.jsx
└── lib/
    ├── auth.js
    └── auth-client.js
```

*Note: This structure represents the main files used by the application. Your actual project may contain additional files.*

## Authentication

Better Auth is used for user authentication, with MongoDB as the database.

Users can:

- Create an account.
- Sign in with their credentials.
- Sign out of their account.

Authentication configuration is managed through environment variables and the Better Auth setup.

## Future Improvements

- Add product search and filtering.
- Add a shopping list and budget planner.
- Add price charts and comparison tools.
- Add more market and product information.
- Improve accessibility and user experience.

## Author

**Mehedi Hasan**

## License

This project was created for educational purposes as part of a Programming Hero assignment.
