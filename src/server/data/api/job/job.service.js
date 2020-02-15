import Job from './job.model'


export const getJob = async (condition) => {
    return Job
        .findOne(condition)
        .lean()
        .exec()
}

export const createJob = async (payload) => {
    return await Job.create(payload)
}

export const updateJob = async(condition, update) => {
    return await Job
        .findOneAndUpdate(condition, {$set:update}, {new: true})
        .lean()
        .exec()
}