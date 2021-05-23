const User = require('../../src/models/user')
const Event = require('../../src/models/event')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    age: 18,
    email: 'john@example.com',
    password: 'john@12345',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY)
    }]
}

const eventOne = {
    startAt: '2021-06-15 10:00:00',
    endAt: '2021-06-15 11:00:00',
    title: 'Test One',
    owner: userOneId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Event.deleteMany()
    await new User(userOne).save()
    await new Event(eventOne).save()
}

module.exports = {
    setupDatabase,
    userOneId,
    userOne,
    eventOne
}