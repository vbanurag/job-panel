import mongoose from 'mongoose'
const Schema = mongoose.Schema

const jobSchema = new Schema({
    title: String,
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    location: String,
    status: { type: String, default: 'PUBLISHED' },
}, {safe: true})


const Job = mongoose.model('Job', jobSchema)
export default Job
