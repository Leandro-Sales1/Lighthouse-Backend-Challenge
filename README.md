# Lighthouse Backend Challenge

## Overview

This project is a **Node.js API** designed for the Lighthouse Backend Challenge. It provides two main endpoints for handling products and shopping cart functionalities.

### Author:
- **Name:** Leandro Sales
- **LinkedIn:** [Leandro Sales](https://www.linkedin.com/in/leandro-sales1/)
- **Portfolio:** [Leandro Sales Portfolio](https://leandro-sales-portfolio.vercel.app/)

---

## Getting Started

### Running Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Leandro-Sales1/Lighthouse-Backend-Challenge
   ```
2. **Navigate to the project directory:**
   ```sh
   cd Lighthouse-Backend-Challenge
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```

### Deployed API

- **Base URL:** [Lighthouse Backend Challenge](https://lighthouse-backend-challenge.vercel.app/)

---

## API Endpoints

### **1. `/products` - Get Product List**
**Method:** `GET`

- Returns a list of all available products.

**Example Response:**
```json
[
  {
    "SKU": "43N23P",
    "name": "Mac Pro",
    "price": 5399.99
  },
  {
    "SKU": "344222",
    "name": "Raspberry Pi",
    "price": 30.00
  }
]
```

---

### **2. `/cart` - Process Cart**
**Method:** `POST`

- Receives a list of products (with SKU and quantity) and returns the total price and detailed product information.

**Request Body Example:**
```json
{
  "cart": [
    {
      "SKU": "43N23P",
      "quantity": 1
    }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "cartTotalPrice": 5399.99,
  "products": [
    {
      "SKU": "43N23P",
      "name": "Mac Pro",
      "price": 5399.99,
      "quantity": 1,
      "finalPrice": 5399.99
    }
  ]
}
```

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Nodemon** - Development utility
- **Jest** - Testing framework

---

## Features

1. Retrieve all available products from the local database.
2. Process a shopping cart, calculating the total price and applying conditional discounts.
3. Validate SKU and quantity for each product in the cart.
4. Return structured responses with detailed product pricing.

---

## Testing the API

To run tests, execute:
```sh
npm test
```

---

## Notes

- Ensure that all products in the cart contain a valid `SKU` and `quantity`.
- Some products may have discounts applied based on cart conditions.

For any questions, feel free to contact me on [LinkedIn](https://www.linkedin.com/in/leandro-sales1/). 🚀

