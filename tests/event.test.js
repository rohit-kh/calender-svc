const request = require('supertest')
const app = require('../src/app')
const {userOne, userOneId, setupDatabase, eventOne} = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should create a new event', async () => {
    await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            startAt: '12-07-2021 10:00:00',
            endAt: '12-07-2021 11:00:00',
            title: '10 to 11'
        })
        .expect(201)
})

test('Should not create event as event is existing with given datetime', async () => {
    await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            startAt: eventOne.startAt,
            endAt: eventOne.endAt,
            title: eventOne.title
        })
        .expect(400)
})


test('Should get two events', async () => {
    const response = await request(app)
        .get('/events')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            startAt: '15-06-2021',
            endAt: '16-06-2021'
        })
        .expect(200)
    expect(response.body.length).toEqual(2)
})
