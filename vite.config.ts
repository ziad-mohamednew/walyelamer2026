import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'نظام المعلم الذكي',
          short_name: 'المعلم الذكي',
          description: 'منصة إدارة وحضور ودرجات الطلاب للمعلمين',
          theme_color: '#00a884',
          background_color: '#0b141a',
          display: 'standalone',
          icons: [
            {
              src: 'https://ui-avatars.com/api/?name=Teacher&background=00a884&color=fff&size=192',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://ui-avatars.com/api/?name=Teacher&background=00a884&color=fff&size=512',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
