const Car = require('../data/Car');
const errorHandler = require('../utilities/error-handler');
const mongoose = require('mongoose');
const Renting = mongoose.model('Rent')

module.exports = {
    addGet: (req, res) => {
        res.render('cars/add')
    },

    addPost: (req, res) => {
        let car = req.body;

        if (car.priceperday <= 0) {
            res.locals.globalError = "Price per day cannot be less then 0";
            return res.render('cars/add', car);

        }

        Car.create({
            make: car.make,
            model: car.model,
            year: car.year,
            pricePerDay: car.priceperday,
            power: car.power,
            image: car.image
        }).then(car => {
            res.redirect('/cars/all')
        }).catch(err => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message;
            res.render('cars/add', car)
        })
    },

    all: (req, res) => {
        let pageSize = 2;
        let page = Number(req.query.page) || 1;
        let search = req.query.search;
        let query = Car.find({});

        if (search) {
            query = query.where('make').regex(new RegExp(search, 'i'))
        }


        query.skip((page - 1) * pageSize).sort('-createdOn').then(cars => {
            res.render('cars/all', {
                cars,
                hasPrev: page > 1,
                hasNext: cars.length > 0,
                nextPage: page + 1,
                prevPage: page - 1,
                search
            })
        })
    },

    rent: (req, res) => {
        let carId = req.params.id;
        let userId = req.user._id;
        let days = parseInt(req.body.days);


        Car.findById(carId).then(car => {
            if (car.isRented) {
                res.locals.globalError = "Car is already rented";
                return res.redirect('back')
            }



            Renting.create({
                user: userId,
                car: carId,
                days: days,
                totalPrice: days * parseInt(car.pricePerDay)
            }).then(rent => {
                car.isRented = true;
                car.save().then(car => {
                    res.redirect('/cars/all');
                })

            }).catch(err => {
                let message = errorHandler.handleMongooseError(err);
                res.locals.globalError = message;
                res.render('cars/all')
            })


        }).catch(err => {
            let message = errorHandler.handleMongooseError(err);
            res.locals.globalError = message;
            res.render('cars/all')
        })

    },

    remove: (req, res) => {
        let carId = req.params.id;
        Renting.findByIdAndRemove(carId).then(rent=> {
           
            Car.findById(rent.car).then(car =>{
                car.isRented = false;
                car.save().then(car => {
                    res.redirect('back')
                })
                })
            })
            
           
    }
}