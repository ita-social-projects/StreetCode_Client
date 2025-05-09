const FRONTEND_ROUTES = {
    BASE: '/',
    ADMIN: {
        BASE: '/admin-panel',
        PARTNERS: '/admin-panel/partners',
        NEW_STREETCODE: '/admin-panel/new-streetcode',
        EDIT_STREETCODE: '/admin-panel/edit-streetcode',
        DICTIONARY: '/admin-panel/dictionary',
        EDITOR: '/admin-panel/editor',
        TEAM: '/admin-panel/team',
        ANALYTICS: '/admin-panel/analytics',
        NEWS: '/admin-panel/news',
        JOBS: '/admin-panel/job',
        CONTEXT: '/admin-panel/context',
    },
    OTHER_PAGES: {
        CATALOG: '/catalog',
        ERROR404: '/404',
        PRIVACY_POLICY: '/privacy-policy',
        CONTACT_US: '/contact-us',
        PARTNERS: '/partners-page',
        SUPPORT_US: '/support-us',
        NEWS: '/news',
        ABOUT_US: '/about-us',
        PROFILE: '/profile',
    },
    AUTH: {
        REGISTER: '/register',
        LOGIN: '/login',
        FORGOT_PASSWORD: '/forgot-password',
    },
};

export default FRONTEND_ROUTES;
