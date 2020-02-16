import express from 'express'
import {
    getJob,
    createJob,
    updateJob,
    fileAnalyze
} from './job.controller'
import multer from 'multer';
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

const router = express.Router()

router.get('/', getJob)
router.post('/', createJob)
router.put('/', updateJob)
router.post('/file-analyze', upload.any(), fileAnalyze)

export default router
