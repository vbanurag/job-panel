import axios from 'axios'


export const getDataService =  async (apiUrl) => {

    return new Promise(async (resolve,rej) => {
        axios.get(
            apiUrl
        ).then(res => {
            console.log(res.data.data)
            resolve(res.data.data)
        }).catch(err => {
            res([])
        })
    })

}

export const postDataService = async (apiUrl, data) => {
    return new Promise(async (resolve,rej) => {
        axios.post(
            apiUrl,
            data
        ).then(res => {
            resolve('Created Successfully ')
            
        }).catch(err => {
            resolve('Something went wrong !!')
        })
    })

}