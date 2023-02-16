WatchStop is a full-stack ecommerce website built with TypeScript, React, Next.js, Node.js, MongoDB, and Tailwind CSS.

Click here to view the deployed live demo [https://watchstop-nextjs.vercel.app/](https://watchstop-nextjs.vercel.app/).

This application is hosted on Vercel and the database is deployed on MongoDB Atlas - please allow a few moments for the initial load.

### Demo Login

The following details can be used to log in as a standard user:

- [demo@gmail.com](mailto:demo@gmail.com)
- password123

# Overview

WatchStop is a scalable, fully responsive, mobile-first ecommerce application, taking advantage of the versatility of Tailwind CSS along with custom styles.

The app features a fully functional online store, with product listings and details, including image, description, price, and stock count. Users can add an item to their cart from the home or product pages, as well as perform actions on the cart page, like updating quantity (dynamically checking the stock count) and removing items.

Once a user has completed their basket, they are guided through a four-step checkout process, which first prompts them to log in if they haven’t already. After delivery and payment information is captured, users can submit their order and complete payment via PayPal.

Product, user, and order data is persisted to MongoDB Atlas, enabling full CRUD functionality across the site. Users can create and manage their account, including viewing and updating their details and orders.

Admin users have additional privileges, with access to sales data and the ability to manage standard users, as well as fulfil orders, and create and edit products. User account access and actions are securely authenticated with JSON Web Token and bcrypt.

# Local Development

To run the application locally:

1. Create a `.env` file with the following environment variables:
   - `DATABASE_URL` - MongoDB database URL
   - `JWT_SECRET` - User authentication key
   - `PAYPAL_CLIENT_ID` - PayPal authentication key
   - `CLOUDINARY_CLOUD_NAME` - Cloudinary username
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary API secret
2. Run `npm run dev` to start the development server.
3. Visit [http://localhost:3000](http://localhost:3000) to view the app.

# Core Technologies

The following technologies make up the core functionality of the application:

- TypeScript
- React
- Next.js - Front-end and API framework
- Node.js
- Axios
- next-connect - Next.js API library
- MongoDB & Mongoose - Data hosting and schemas
- Tailwind CSS - Utility classes (including custom classes) for styling
- React Hook Form - Form construction and validation
- Notistack - Client-side notifications
- JSON Web Token & bcrypt - Authentication and encryption
- PayPal - Payment
- Cloudinary - Image hosting
- Chart.js & react-chartjs-2

# Functionality

Notable functionality includes:

- State management with React Context API
- Forms and form validation with React Hook Form
- User feedback notifications with Notistack
- Backend API with next-connect
- JSON Web Token and bcrypt for user authentication
- CRUD operations on database models with Mongoose
- Database deployment with MongoDB Atlas
- Admin dashboard charts with Charts.js
- File upload with Multer and Streamifier
- Cloud image hosting with Cloudinary
- Payment gateway with PayPal
- Application deployment with Vercel

# Main Features

Below is an overview of the main features in this application, broken down by page, section, and category:

## Header

- Cart page link, including cart items notification
- User account links (when logged in) - dynamic depending on standard or admin user:
  - Dashboard (admin only)
  - Account
  - Orders
  - Logout

![Header navigation](/public/images/readme/header.png)

## Home page

- Product listings

![Home page](/public/images/readme/home-page.png)

## Product page

- Full product description, including category, brand, rating, price
- Current stock count
- Add to cart button - redirects to cart page

![Product page](/public/images/readme/product-page.png)

## Cart page

- Table with product information, including image, name, quantity, price
- Quantity dropdown
- Delete from cart button
- Order summary
- Checkout button - redirects to checkout page, or login page if user is logged out

![Cart page](/public/images/readme/cart-page.png)

## Login page

- Sign-in form with validation
- Link to regsiter page

![Login page](/public/images/readme/login-page.png)

## Register page

- Sign-up form with validation
- Link to login page

![Register page](/public/images/readme/register-page.png)

## Checkout wizard

- Delivery address - user prompted for delivery information

![Delivery information](/public/images/readme/delivery-step.png)

- Payment method - user to select payment method (currently PayPal offered)

![Payment method](/public/images/readme/payment-step.png)

- Order confirmation
  - Order overview including cart contents, delivery information, payment method
  - Order summary including tax, totals
  - Place order button - redirects to order details page

![Order confirmation](/public/images/readme/order-step.png)

- Order details
  - Confirmation of order including products, delivery address, payment method, payment status
  - Order summary including taxes, totals
  - PayPal payment button - redirects to PayPal for payment (PayPal sandbox available)
  - Once paid, payment status updated on order confirmation

![Order details](/public/images/readme/order-details.png)
![PayPal login](/public/images/readme/paypal-login.png)
![PayPal payment](/public/images/readme/paypal-payment.png)
![Order status - admin user](/public/images/readme/order-status-admin.png)
![Order status - standard user](/public/images/readme/order-status-standard.png)

## Standard user account

- Accessed by clicking on the user’s name in the header

![User account access](/public/images/readme/user-account-access.png)

- User can update account details:

![Update user details](/public/images/readme/update-user-details.png)

- User can view order history:

![Order history](/public/images/readme/order-history.png)

## Admin user account

### Dashboard

- Dashboard with data overview:

![Admin dashboard](/public/images/readme/admin-dashboard.png)

### Orders

- List of orders and their status:

![Orders](/public/images/readme/orders.png)

- Order details - admin user can change order status by delivering order:

![Fulfil order](/public/images/readme/fulfil-order.png)
![Order fulfilled](/public/images/readme/order-fulfilled.png)

### Products

- Product inventory:

![Product inventory](/public/images/readme/product-inventory.png)

- Create new product
- Edit product, including image upload to Cloudinary:

![Edit product](/public/images/readme/edit-product.png)

### Users

- Users list:

![Users list](/public/images/readme/users-list.png)

- Edit user permissions:

![Edit user](/public/images/readme/edit-user.png)

## Notifications

Throughout the app, notification modals display to confirm successful actions to the user or to warn of validation issues or errors. Examples include:

- Success message:

![Success message](/public/images/readme/success-message.png)

- Error message:

![Error message](/public/images/readme/error-message.png)

## Form validation

Form validation is in place across the application to inform the user of input issues. Here are some examples:

- Required fields:

![Required fields](/public/images/readme/required-fields.png)

- Invalid password:

![Invalid password](/public/images/readme/invalid-password.png)

# Future features

- Planned:
  - Unit testing
- Desirable:
  - Product search
  - Product filters
  - Product sort
  - Product pagination
  - Product reviews
  - Product feature carousel on home page
  - Stripe payment integration
  - Email order receipts to customers
  - Google Maps integration for customer addresses

# Known issues

- User logout action briefly redirects to ‘application error’ page in production deployment.
