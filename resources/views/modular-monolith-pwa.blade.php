<!DOCTYPE html>
<html lang="sk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#e30613">
        <title>Hlásenie poruchy (Modulárny Monolit)</title>
        
        <script>
            window.config = {
                vapidPublicKey: "{{ config('services.webpush.public_key') }}"
            };
        </script>
        @vite(['resources/css/app.css', 'resources/js/modular-app.js'])
    </head>
    <body class="bg-slate-100 text-slate-900 font-sans antialiased">
        <div id="app"></div>
    </body>
</html>