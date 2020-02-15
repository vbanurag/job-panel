import express from 'express'
import {
    getJob,
    createJob,
    updateJob
} from './job.controller'

const router = express.Router()

router.get('/', getJob)
router.post('/', createJob)
router.put('/', updateJob)

export default router
