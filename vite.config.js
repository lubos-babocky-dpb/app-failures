import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            fonts: false,
        }),
        tailwindcss(),
        vue(),
        VitePWA({
            strategies: 'generateSW',
            registerType: 'autoUpdate',
            injectRegister: null,
            buildBase: '/build/',
            manifest: {
                name: 'Dopravný podnik Bratislava - Poruchy',
                short_name: 'DPB Poruchy',
                description: 'PWA aplikácia na hlásenie technických porúch vozidiel DPB.',
                theme_color: '#e30613',
                background_color: '#f1f5f9',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                importScripts: ['/push-notification-listener.js'],
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                // Presmeruje offline požiadavky na Laravel index (zabezpečí beh Vue routeru offline)
                navigateFallback: '/', 
                // Ignoruj API požiadavky, tie nechceme vracať ako fallback HTML
                navigateFallbackDenylist: [/^\/api/] 
            }
        })
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});