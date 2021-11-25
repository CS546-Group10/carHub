const searchCarRoutes = require('./searchCar');
const landingRoutes = require('./landing');
const loginRoutes = require('./loginRoutes/login');
const mycars = require('./mycars');
const myBookings= require('./bookings');
const path = require('path')

const constructorMethod = (app) => {

    app.use('/searchCar', searchCarRoutes);
    app.get('/', landingRoutes);
    app.use('/login', loginRoutes);
    app.use('/myCar', mycars);
    app.use('/myBookings', myBookings);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;