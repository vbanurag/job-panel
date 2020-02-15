export const getJob = (req,res) => {
    console.log(req)
    return res.status(200).send({
        message: 'done'
    })
}
