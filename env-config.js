// Environment Configuration Loader
// This script helps load environment variables in different deployment scenarios

(function() {
    // Check if we're in a build environment with process.env
    if (typeof process !== 'undefined' && process.env) {
        // Webpack/Vite/Parcel build environment
        window.ENV = {
            API_URL: process.env.REACT_APP_API_URL || 
                    process.env.VUE_APP_API_URL || 
                    process.env.API_URL,
            NODE_ENV: process.env.NODE_ENV,
            DEBUG: process.env.ENABLE_DEBUG_LOGS === 'true'
        };
        return;
    }

    // Check for runtime configuration (for static deployments)
    const hostname = window.location.hostname;
    
    // Default configuration based on environment
    const defaultConfig = {
        development: {
            API_URL: 'http://127.0.0.1:8000/api',
            DEBUG: true
        },
        production: {
            API_URL: 'https://Nithish6606.pythonanywhere.com/api',
            DEBUG: false
        }
    };

    // Determine environment
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
    const environment = isDevelopment ? 'development' : 'production';
    
    // Set global configuration
    window.ENV = {
        ...defaultConfig[environment],
        NODE_ENV: environment
    };

    // Log configuration in development
    if (isDevelopment) {
        console.log('Environment Configuration:', window.ENV);
    }
})();