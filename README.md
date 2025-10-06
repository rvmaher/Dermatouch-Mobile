# Dermatouch Mobile 🌿

> **Note**: This app is designed and optimized for Android devices only due to time constraints.

A modern React Native e-commerce app for skincare products built with Expo, featuring secure authentication, cart management, payment integration, and order tracking.

## Features

### 🔐 Authentication

- Secure user registration and login
- Token-based authentication with refresh tokens
- Secure token storage using Expo SecureStore
- User session management

### 🛍️ Shopping Experience

- Browse skincare products with search and filtering
- Category-based product organization
- Product details with images and descriptions
- Add to cart functionality with quantity management
- User-specific cart persistence

### 💳 Payment & Checkout

- Razorpay payment gateway integration
- Secure payment processing
- Address management for delivery
- Order confirmation and receipt

### 📦 Order Management

- Real-time order tracking
- Order history and status updates
- Detailed order information with items
- Delivery address tracking

### 🎨 Modern UI/UX

- Clean, intuitive interface
- Smooth animations and transitions
- Toast notifications for user feedback
- Responsive design for all screen sizes
- Dark/Light theme support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Payments**: Razorpay
- **Storage**: Expo SecureStore, AsyncStorage
- **UI Components**: Custom components with Lucide React Native icons
- **Typography**: Manrope font family

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## Configuration

### Payment Setup

The app uses Razorpay for payment processing. The current key is for demo purposes only:
