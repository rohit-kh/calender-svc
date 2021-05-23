const express = require('express')
const moment = require('moment')
const Event = require('../models/event')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/events', auth, async (req, res) => {
	try{
		let startAt = moment(req.body.startAt, 'DD-MM-YYYY HH:mm:ss', true);
		let endAt = moment(req.body.endAt, 'DD-MM-YYYY HH:mm:ss', true);
		if(!(startAt.isValid() && endAt.isValid())){
			throw new Error('Invalid date format. Please use DD-MM-YYYY HH:mm:ss(15-05-2021 15:00:00) format')
		}		
			
		const event = new Event({
			...req.body,
			startAt: startAt.format('YYYY-MM-DD HH:mm:ss'),
			endAt: endAt.format('YYYY-MM-DD HH:mm:ss'),
			owner: req.user._id
		})
		await event.save() 
		res.status(201).send(event)
	}catch (e){
		res.status(400).send({error: e.message})
	}
})

router.get('/events', auth, async (req, res) => {
	let startAt = moment(req.query.startAt, 'DD-MM-YYYY', true);
	let endAt = moment(req.query.endAt, 'DD-MM-YYYY', true);
	if(!(startAt.isValid() && endAt.isValid() && startAt.isSameOrBefore(endAt))){
		throw new Error('Invalid date format. Please use DD-MM-YYYY format')
	}

	startAt = startAt.format('YYYY-MM-DD')
	endAt = new Date(endAt.format('YYYY-MM-DD'))
	endAt.setUTCHours(23)
	endAt.setUTCMinutes(59)
	endAt.setUTCMilliseconds(59)
	try{
		const events = await Event.find({ 
			startAt: {
				$gte: new Date(startAt),
				$lte: new Date(endAt)
			}	
		})
		res.send(events)
	}catch (e) {
		res.status(400).send({error: e.message})
	}
})

module.exports = router