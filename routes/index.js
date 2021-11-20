const userRoutes = require('./loginRoutes/login');
const path = require('path')

const constructorMethod = (app) => {

    app.use('/', userRoutes);
    app.use('*', (req, res) => {
        res.render('landing/index', { title: 'Landing Page' })
    })
}
module.exports = constructorMethod