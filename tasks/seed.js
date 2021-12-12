const mongoCollections = require("../config/mongoCollections");
const db = require("../config/mongoConnection")
const users = mongoCollections.users;
const data = require("../data/");
const { ObjectID } = require("mongodb");
const user = data.usersdata
const bcrypt = require('bcryptjs');


const user_one = {
    email: 'amm.mistry@gmail.com',
    password: bcrypt.hashSync('password', 10),
    firstName: 'Anshul',
    lastName: 'Mistry',
    phoneNumber: '5555555555',
    role: 'user',
    address: {
        number: '113',
        street: 'Irving St',
        city: 'jersey city',
        state: 'NJ',
        zip: '07307'
    },
    cars: [{
            _id: new ObjectID(),
            brandName: 'Lambo',
            color: 'Black',
            number: '123456',
            capacity: 2,
            rate: 1000,
            status: "APPROVED"
        },
        {
            _id: new ObjectID(),
            brandName: 'Honda',
            color: 'Black',
            number: '135790',
            capacity: 4,
            rate: 100,
            status: "APPROVED"
        }
    ]
}
const user_two = {
    email: 'tusharbatla@gmail.com',
    password: bcrypt.hashSync('password', 10),
    firstName: 'Tushar',
    lastName: 'Batla',
    phoneNumber: '5555555555',
    role: 'user',
    address: {
        number: '48',
        street: 'Irving St',
        city: 'jersey city',
        state: 'NJ',
        zip: '07307'
    },
    cars: [{
            _id: new ObjectID(),
            brandName: 'Ford',
            color: 'Black',
            number: '111222',
            capacity: 6,
            rate: 150,
            status: "APPROVED"
        },
        {
            _id: new ObjectID(),
            brandName: 'Mustang',
            color: 'Black',
            number: '111333',
            capacity: 4,
            rate: 500,
            status: "APPROVED"
        }
    ]
}

const user_three = {
    email: 'amm.mistry@gmail.com',
    password: bcrypt.hashSync('password', 10),
    firstName: 'Ra',
    lastName: 'One',
    phoneNumber: '5555555555',
    role: 'user',
    address: {
        number: '50',
        street: 'Ball Ave',
        city: 'parsippany',
        state: 'NJ',
        zip: '07054'
    },
    cars: [{
            _id: new ObjectID(),
            brandName: 'Acura',
            color: 'Black',
            number: '222333',
            capacity: 5,
            rate: 110,
            status: "APPROVED"
        },
        {
            _id: new ObjectID(),
            brandName: 'Honda',
            color: 'White',
            number: '333444',
            capacity: 4,
            rate: 100,
            status: "APPROVED"
        }
    ]
}

const admin = {
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('admin123', 10),
    firstName: 'Admin',
    lastName: 'Tester',
    phoneNumber: '5555555555',
    role: 'admin',
    address: {
        number: '113',
        street: 'Irving St',
        city: 'jersey city',
        state: 'NJ',
        zip: '07307'
    },
    cars: []
}

const seed = async() => {
    const userCollection = await users();
    await userCollection.insertOne(user_one);
    await userCollection.insertOne(user_two);
    await userCollection.insertOne(user_three);
    await userCollection.insertOne(admin);
}

seed().then(() => {
    console.log('done seeding database');
    db.closeConnection()
})