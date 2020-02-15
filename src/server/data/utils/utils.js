import _ from 'lodash'
import Promise from 'bluebird'

const createFriendlyUrl = async (DomainModel, friendlyUrl, userCondition) => {
    return new Promise(async (resolve, reject) => {
        try {
            let friendlyUrls = await getFriendlyUrlsLike(DomainModel, friendlyUrl, userCondition)
            let friendlyUrlCounters = _.transform(friendlyUrls, (result, friendlyUrl) => {
                let counter = parseInt(friendlyUrl.split('-').pop())
                if (!isNaN(counter)) {
                    return result.push(parseInt(friendlyUrl.split('-').pop()))
                } else {
                    return result.push(0)
                }
            })
            let counter = friendlyUrlCounters.length ? _.max(friendlyUrlCounters) + 1 : 0
            // Do not append digit if there exists no matching friendly url's
            let urlSuffix = counter ? '-' + (counter) : ''
            resolve(friendlyUrl + urlSuffix)
        } catch (err) {
            reject(err)
        }
    })
}

const getFriendlyUrlsLike = (DomainModel, friendlyUrl, userCondition) => {
    return new Promise((resolve, reject) => {
        let condition = {}
        if (userCondition) {
            condition = userCondition
        }
        condition['friendlyUrl'] = new RegExp(friendlyUrl)
        DomainModel.find(condition, {'friendlyUrl': 1}, (err, friendlyUrls) => {
            if (err) {
                reject(err)
            }
            let retResult = _.transform(friendlyUrls, (result, obj) => {
                return result.push(obj.friendlyUrl)
            })
            resolve(retResult)
        })
    })
}
const cleanUpNationalCharacters = (string) => {
    if (typeof string === 'string') {
        return string
            .toLowerCase()
            .trim()
            .replace(/[aàáâäãåāa]/g, 'a')
            .replace(/[eeèéêëēėę]/g, 'e')
            .replace(/[oôöòóœøōõ]/g, 'o')
            .replace(/[\s\/_]/g, '-')
            .replace(/[^A-Za-z0-9\-]/g, '')// Remove unsafe characters
            .replace(/-+/g, '-')
    } else {
        return ''
    }
}
const suggestedFriendlyUrl = (suggestedName, friendlyUrls) => {
    if (!friendlyUrls.hasOwnProperty(suggestedName)) {
        friendlyUrls[suggestedName] = 1
        return suggestedName
    } else {
        var newName = suggestedName + '-' + friendlyUrls[suggestedName]
        friendlyUrls[suggestedName] += 1
        return suggestedFriendlyUrl(newName, friendlyUrls)
    }
}

export default {
    createFriendlyUrl,
    suggestedFriendlyUrl,
    cleanUpNationalCharacters,
}

