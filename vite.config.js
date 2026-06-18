import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is the development server and build tool for the React app.
export default defineConfig({
  // The React plugin enables JSX transformation and React Fast Refresh in development.
  plugins: [react()],
  server: {
    // Keep the frontend port predictable for the backend CORS setting.
    port: 5173
  }
});
