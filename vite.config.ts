import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      'router': path.resolve(__dirname, './src/router'),
      '@app': path.resolve(__dirname, './src/app'),
      '@components': path.resolve(__dirname, './src/view/components'),
      '@layouts': path.resolve(__dirname, './src/view/layouts'),
      '@pages': path.resolve(__dirname, './src/view/pages'),
    },
  }
});
