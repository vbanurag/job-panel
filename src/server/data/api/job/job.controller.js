import {
    create,
    update,
    jobs
} from './job.service';
import pdfParser from 'pdf-parser'
import tempWrite from 'temp-write'
const PDFParser = require("pdf2json")
import path from 'path';
const fs = require('fs');
const libre = require('libreoffice-convert');
import toPdf from 'office-to-pdf'
var jsZip = require('jszip')
//let pdfParser = new PDFParser();


export const getJob = async (req, res) => {
    let data = await jobs()
    return res.status(200).send({
        message: 'done',
        data: data
    })
}


export const createJob = async (req, res) => {
    await create(req.body)
    return res.status(200).send({
        message: 'done',
    })
}

export const updateJob = async (req, res) => {

    return res.status(200).send({
        message: 'done',
    })
}

export const fileAnalyze = async (req, res) => {
    let fileName = req.files[0].originalname
    let filePath = tempWrite.sync(req.files[0].buffer);

    if (fileName.split('.')[1] == 'doc' || fileName.split('.')[1] == 'docx') {
        // filePath = await readXML(filePath)
        return res.send({})
    }

    pdfParser.pdf2json(filePath, function (error, pdf) {
        if (error != null) {
            console.log(error);
            res.send({
                data: []
            })
        } else {
            return res.send({
                data: pdf.pages
            })
        }
    });

}

const docToPdf = async (url) => {
    return new Promise(async (res, rej) => {
        
        var pdfBuffer = await toPdf(url)
        res(pdfBuffer)
    })
}


const readXML = async (file) => {
    
    jsZip.loadAsync(file).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
            console.log(fileName, '----name')
            zip.files[filename].async('string').then(function (fileData) {
                console.log(fileData) // These are your file contents      
            })
        })
    })
}