import express from 'express'
import Job from './data/api/job'
const router = express.Router()

router.use('/job',Job)

export default router
