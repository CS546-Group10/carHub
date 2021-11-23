const searchCarRoutes = require('./searchCar');
const landingRoutes = require('./landing');
// const myCarRoutes = require("./myCar");
// const myBooingsRoutes = require("./myBookings");
// const logoutRoutes = require("./logout")

const constructorMethod = (app) => {

    app.use('/searchCar', searchCarRoutes);
    app.get('/', landingRoutes);
    
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;