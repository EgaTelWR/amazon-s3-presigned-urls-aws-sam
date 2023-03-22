'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// The Lambda handler
exports.handler = async (event) => {
    console.log('Move ConsumerObject function starts : ')
    console.log(JSON.stringify(event, 2, null))

    console.log('Move ConsumerObject : Start scanning the object!')
    await sleep(1000)
    console.log('Move ConsumerObject : Scan finished!')

    console.log('Move ConsumerObject : Copying the object to the destination bouquet !')
    await sleep(1000)
    console.log('Move ConsumerObject : Copy completed!')
}