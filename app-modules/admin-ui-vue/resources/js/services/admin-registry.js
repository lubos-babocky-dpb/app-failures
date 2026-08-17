const routes = [];
const menuItems = [];

const admin = {
    registerRoute(route) {
        routes.push(route);
    },

    registerMenuItem(item) {
        menuItems.push(item);
    },

    getRoutes() {
        return [...routes];
    },

    getMenuItems() {
        return [...menuItems];
    },
};

admin.registerMenuItem({
    label: 'Dashboard',
    route: 'admin.dashboard'
})

export default admin;