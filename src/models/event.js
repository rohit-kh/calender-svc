const mongoose = require('mongoose')
const validator = require('validator')
const moment = require('moment')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null,
        trim: true,
    },
    startAt: {
        type: Date,
        required: true,
        validate: [isValidStartDate, 'Start Date must be greather than Current timestamp']
    },
    endAt: {
        type: Date,
        required: true,
        validate: [compareDate, 'Start Date must be less than End Date']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
},
{
    timestamps: true
})

eventSchema.methods.toJSON = function(){
    const event = this
    const eventObject = event.toObject()
    eventObject['startAtLocalFormat'] = moment(eventObject.startAt).format('DD-MM-YYYY h:mm A')
    eventObject['endAtLocalFormat'] = moment(eventObject.endAt).format('DD-MM-YYYY h:mm A')
    return eventObject 
}

function compareDate(value) {
    return new Date(this.startAt).getTime() < new Date(value).getTime();
}

function isValidStartDate(value) {
    return value > new Date().getTime();
}

eventSchema.post('validate', async function(body) {
    const checkIsConflictWithDateTime = await isConflictWithDateTime(body);
    if(checkIsConflictWithDateTime){
        throw new Error('There is conflict between given datetime and existing event datetime')
    }
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event

const isConflictWithDateTime = async (body) => {
    const startDate = body.startAt
	const endDate = body.endAt
	const events = await Event.find({ 
		$or: [
			{
				startAt: {
					$lte: startDate 
				},
				endAt: {
					$gte: startDate
				}
			},
			{
				startAt: {
					$lte: endDate 
				},
				endAt: {
					$gte: endDate
				}
			},
			{
				startAt: {
					$gte: startDate, 
					$lte: endDate
				}
			}
		],
        owner: body.owner
	})
    // console.log('Event List: ', events)
	return (events.length > 0)? true: false;
}