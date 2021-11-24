const searchCarRoutes = require('./searchCar');
const landingRoutes = require('./landing');
const loginRoutes = require('./loginRoutes/login');
const path = require('path')

const constructorMethod = (app) => {

    app.use('/searchCar', searchCarRoutes);
    app.get('/', landingRoutes);
    app.use('/login', loginRoutes);
    
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;