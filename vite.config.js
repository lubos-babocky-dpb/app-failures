import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/modular-app.js',
                'app-modules/admin-ui-vue/resources/js/app.js'
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
            devOptions: {
                enabled: true,
                type: 'module'
            },
            workbox: {},
            navigateFallback: '/pwa-new',
            navigateFallbackDenylist: [/^\/api/],
            manifest: {
                id: '/',
                name: 'DPB - Hlásenie porúch',
                short_name: 'Poruchy',
                description: 'Hlásenie porúch',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                theme_color: '#dc2626',
                background_color: '#ffffff',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
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