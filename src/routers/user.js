const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
	try{
		const user = new User(req.body)
		await user.save()
		const token = await user.generateAuthToken()

		res.status(201).send({user, token})
	}catch (e){
		res.status(400).send(e)
	}
})

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})	

router.post('/users/logout', auth, async (req, res) => {
	try{
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		
		console.log(req.token);

		await req.user.save()
		console.log(req.user)
		res.send()
	} catch(e) {
		res.status(500).send(e)
	}
})

router.post('/users/logoutAll', auth, async (req, res) => {
	try{
		req.user.tokens = []
		await req.user.save()
		res.send()
	} catch(e) {
		res.status(500).send(e)
	}
})

router.post('/users/login', async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()

		res.send({user, token})
	}catch (e){
		res.status(400).send(e)
	}
})

module.exports = router