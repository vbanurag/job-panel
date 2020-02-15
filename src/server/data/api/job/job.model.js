import mongoose from 'mongoose'
const Schema = mongoose.Schema

const jobSchema = new Schema({
    title: String,
    description: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: Date.now()
    },
    location: String,
    status: { type: String, default: 'PUBLISHED' },
}, {safe: true})

continentSchema.index({
    'type': 1,
    'friendlyUrl': 1
})

const Job = mongoose.model('Job', jobSchema)
export default Job
