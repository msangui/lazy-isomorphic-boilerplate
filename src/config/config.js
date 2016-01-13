module.exports = {
    development: {
        isProduction: false,
        port: process.env.PORT || 3000,
        app: {
            name: 'Boilerplate Development'
        }
    },
    production: {
        isProduction: true,
        port: process.env.PORT,
        app: {
            name: 'Boilerplate Production'
        }
    }
}[process.env.NODE_ENV || 'development'];
