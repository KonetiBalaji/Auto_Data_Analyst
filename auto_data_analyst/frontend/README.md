# Auto Data Analyst Frontend

This is the frontend application for the Auto Data Analyst project, built with React and Material-UI.

## Features

- Modern, responsive UI with Material-UI components
- Dark mode support
- Real-time notifications
- Data visualization with Recharts
- File upload and management
- Model training and evaluation
- Report generation
- User settings management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd auto_data_analyst/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React context for state management
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions and API calls
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── theme.js          # Material-UI theme configuration
├── package.json
└── README.md
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Dependencies

- React
- Material-UI
- React Router
- Recharts
- Axios
- React Query

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 