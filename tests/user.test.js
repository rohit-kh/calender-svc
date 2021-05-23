const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')
const {userOne, userOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        'name': 'Mike',
        'age': 20,
        'email': 'mike@example.com',
        'password': 'mike@12345'
    }).expect(201)
})

test('Should login for existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should login for nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'doe@example.com',
        password: 'JDNJDks33222ks'
    }).expect(400)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})