# Lani Eats - Food Ordering App

A modern, responsive food ordering mobile application built with React Native and Expo Router.

## Features

### 🏠 Home Screen
- **Welcome Section**: Personalized greeting with user's name and location
- **Banner**: Promotional banner with food image and call-to-action
- **Popular Restaurants**: Horizontally scrollable list of featured restaurants
- **Top Meals**: Vertically scrollable list of popular meals with action buttons

### 🍽️ Restaurant Details
- **Restaurant Information**: Name, location, rating, reviews, delivery time, and description
- **Action Buttons**: Send message and call restaurant
- **Category Filters**: Filter meals by category (All, Soups, Snacks, Rice & Pasta, etc.)
- **Meal List**: Display all meals from the selected restaurant with add to cart functionality

### 🍕 Meal Details
- **Meal Information**: Name, description, price, category, preparation time, and spice level
- **Quantity Selector**: Increase/decrease quantity with +/- buttons
- **Detailed Information**: Ingredients list and allergen information
- **Action Buttons**: Order now and add to cart with selected quantity

### 🛒 Shopping Cart
- **Cart Management**: Add, remove, and update quantities of meals
- **Cart Summary**: Subtotal, delivery fee, and total calculation
- **Empty State**: Friendly message when cart is empty with option to start shopping
- **Checkout**: Proceed to checkout functionality

### 🔍 Search & Navigation
- **Search Screen**: Search for food, restaurants, or categories
- **Popular Searches**: Quick access to common search terms
- **Search Results**: Display filtered results with meal details

### 📱 Additional Features
- **Order History**: Track previous orders with reorder functionality
- **User Profile**: Manage personal information, preferences, and settings
- **Tab Navigation**: Home, Search, History, and Profile tabs
- **Responsive Design**: Optimized for various screen sizes

## Technical Implementation

### Architecture
- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based routing system
- **TypeScript**: Type-safe development
- **Context API**: State management for cart functionality

### Key Components
- **CartContext**: Manages shopping cart state and operations
- **Themed Components**: Consistent styling across the app
- **Navigation**: Seamless navigation between screens
- **Dummy Data**: Sample data for demonstration purposes

### State Management
- **Cart State**: Items, quantities, total items, and total amount
- **Local State**: UI state for individual components
- **Navigation State**: Screen routing and parameters

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Usage

### Adding Items to Cart
1. Navigate to any meal from the home screen or restaurant page
2. Use the quantity selector to choose desired amount
3. Tap "Add to Cart" button
4. View cart by tapping the cart icon in the header

### Managing Cart
1. Access cart from the home screen header
2. Modify quantities using +/- buttons
3. Remove items using the trash icon
4. Clear entire cart using the "Clear" button
5. Proceed to checkout when ready

### Browsing Restaurants
1. Tap on any restaurant card from the home screen
2. View restaurant details and available meals
3. Filter meals by category using the horizontal scroll
4. Add meals to cart or view detailed information

## Customization

### Adding New Restaurants
- Update the `restaurants` object in `app/restaurant/[id].tsx`
- Add corresponding meals to the `restaurantMeals` object
- Ensure unique IDs for all items

### Modifying Meal Data
- Update meal information in the respective data objects
- Add new meal properties as needed
- Update TypeScript interfaces for type safety

### Styling Changes
- Modify the `styles` object in each component
- Update color schemes in `constants/Colors.ts`
- Customize fonts and spacing as needed

## Future Enhancements

- **User Authentication**: Login/registration system
- **Payment Integration**: Secure payment processing
- **Real-time Updates**: Live order tracking
- **Push Notifications**: Order status updates
- **Offline Support**: Cache data for offline usage
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
