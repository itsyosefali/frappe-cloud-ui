# SASS Manager Dashboard

A modern, responsive dashboard for managing SASS applications with billing, sites, and user management capabilities.

![Dark and Light Mode Support](https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=2000)

## Features

- 🌓 Dark/Light mode with system preference detection
- 📱 Fully responsive design
- 🔐 Authentication system with login/signup
- 💳 Comprehensive billing management
- 🖥️ Site management dashboard
- 📊 Usage analytics and charts
- 🎨 Beautiful UI with smooth animations

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Type Safety**: TypeScript
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── billing/       # Billing-related components
│   ├── sites/         # Site management components
│   └── ui/            # Common UI components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Components

### Authentication
- Login and Signup pages with form validation
- Protected routes for authenticated users

### Billing Management
- Invoice tracking and filtering
- Payment method management
- Usage monitoring
- Recurring charges overview

### Site Management
- Site overview with resource usage
- Performance monitoring
- Domain management
- Backup controls

## Development Guidelines

1. **Component Structure**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Implement proper error boundaries

2. **State Management**
   - Use React Context for global state
   - Implement custom hooks for reusable logic
   - Keep state close to where it's used

3. **Styling**
   - Use Tailwind CSS utility classes
   - Maintain consistent spacing and colors
   - Support both dark and light themes

4. **Performance**
   - Implement proper code splitting
   - Use React.memo for expensive components
   - Optimize images and assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for your own purposes.