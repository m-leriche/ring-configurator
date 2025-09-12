# Ring Configurator

A modern React application for visualizing and configuring ring stacks with interactive carousels and dynamic stacking previews.

## Features

- **Interactive Ring Carousels**: Three independent carousels for selecting different rings
- **Real-time Stack Preview**: Visual preview of how rings stack together
- **Dynamic Ring Positioning**: Automatic calculation of ring thickness for realistic stacking
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Powered by Motion (Framer Motion successor)

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Motion** - Animation library (Framer Motion successor)
- **React Slick** - Carousel component library

## Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd configurator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code using Prettier

## How to Use

1. **Select Rings**: Use the three carousels to select different rings for your stack
2. **Preview Stack**: Click the "Show Stack" button to see how your rings will look when stacked
3. **View Details**: The modal shows both the visual stack and configuration details with pricing

### Ring Selection

- Each carousel displays multiple ring options
- Use the arrow buttons to navigate through available rings
- The center ring in each carousel is highlighted and will be selected for the stack
- Real-time visual feedback shows which ring is currently selected

### Stack Preview

- The modal displays rings in the correct stacking order
- Ring thickness is automatically calculated for realistic positioning
- Configuration details show selected rings with materials and pricing
- Total price is calculated automatically

## Project Structure

```
src/
├── components/
│   ├── AutoCroppedImage.tsx    # Smart image component with auto-cropping
│   ├── Carousel.tsx            # Ring carousel component
│   └── ImageModal.tsx          # Stack preview modal
├── assets/                     # Ring images
├── types/
│   └── carousel.ts             # TypeScript type definitions
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Customization

### Adding New Rings

1. Add new ring images to the `src/assets/` directory
2. Import the images in `src/App.tsx`
3. Add new ring objects to the `ringItems` array with the following structure:

```typescript
{
  image: ringImageImport,
  title: 'Ring Name',
  price: 'CA$X,XXX',
  variantLabel: 'Material Type',
}
```

### Styling

The project uses Tailwind CSS for styling. You can:

- Modify existing styles in component files
- Update the Tailwind configuration in `tailwind.config.js`
- Add global styles in `src/index.css`

### Animations

Animation configurations can be modified in the component files using the Motion library:

- Carousel transitions in `Carousel.tsx`
- Modal animations in `ImageModal.tsx`
- Ring stacking animations in `ImageModal.tsx`

## Development Tips

- The development server supports hot module replacement (HMR)
- TypeScript provides type safety - pay attention to type errors
- ESLint is configured to catch common issues
- Prettier is set up for consistent code formatting

## Building for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized production files ready for deployment.

## Browser Support

This application supports modern browsers that support:

- ES2020 features
- CSS Grid and Flexbox
- Modern JavaScript APIs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is private and not licensed for public use.
# ring-configurator
