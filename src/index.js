const app = require('./app')

app.listen(process.env.PORT, () => {
	console.log('Server is up on port ' + process.env.PORT)
	console.log('Server Environment ' + process.env.NODE_ENV)
})

