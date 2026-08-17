import admin from './admin-registry.js';

const modules = import.meta.glob(
    '/app-node-modules/*/resources/js/admin.js',
    {
        eager: true,
    },
);

for (const module of Object.values(modules)) {
    if (typeof module.register === 'function') {
        module.register(admin);
    }
}