export const routesConfig = {
    '/': { requiresAuth: false, title: 'Home' },
    '/login': { requiresAuth: false, title: 'Login' },
    '/signup': { requiresAuth: false, title: 'Signup' },
    '/chat': { requiresAuth: true, title: 'Chatbot' },
};
