import Job from './job.model'

export const jobs = async (condition) => {
    return Job
        .find(condition)
        .lean()
        .exec()
}

export const create = async (payload) => {
    return await Job.create(payload)
}

export const update = async(condition, update) => {
    return await Job
        .findOneAndUpdate(condition, {$set:update}, {new: true})
        .lean()
        .exec()
}