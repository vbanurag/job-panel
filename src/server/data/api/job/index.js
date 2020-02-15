import express from 'express'
import {
    getJob
} from './job.controller'

const router = express.Router()

router.get('/:id', getJob)

export default router
