import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                app: 'resources/js/modular-app.js',
                sw: 'resources/js/modular-sw.js' // Vite teraz vie, že tento súbor má spracovať
            }
        }
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.js',                          // Starý vstupný bod (pre istotu ponechaný)
                'resources/js/modular-app.js',                  // NOVÝ vstupný bod pre našu čistú architektúru
                'app-modules/admin-ui-vue/resources/js/app.js'  // admin login
            ],
            refresh: true,
            fonts: false,
        }),
        tailwindcss(),
        vue(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'resources/js',
            filename: 'modular-sw.js',
            outDir: 'public',
            injectRegister: null,
            registerType: 'autoUpdate',
            workbox: {},
            navigateFallback: '/pwa-new',
            navigateFallbackDenylist: [/^\/api/],
            manifest: {},
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            }
        })
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});