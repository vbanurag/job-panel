import {
    create,
    update,
    jobs
} from './job.service';

export const getJob = async (req,res) => {
    let data = await jobs()
    return res.status(200).send({
        message: 'done',
        data: data
    })
}


export const createJob = async (req,res) => {
    await create(req.body)
    return res.status(200).send({
        message: 'done',
    })
}

export const updateJob = async (req,res) => {
    
    return res.status(200).send({
        message: 'done',
    })
}
