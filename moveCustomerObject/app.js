'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// The Lambda handler
exports.handler = async (event) => {
    console.log('Move ConsumerObject function starts v2: ')
    console.log(JSON.stringify(event, 2, null))


    console.log('Move ConsumerObject : Start scanning the object!')

    //get the name of Object to copy
    let s3ObjectName = null
    try {
        const s3EventRaw  = event['Records'][0]['body']
        console.log("S3 EventRaw :", s3EventRaw)

        const s3Event = JSON.parse(s3EventRaw)

        s3ObjectName  = s3Event['Records'][0]['s3']['object']['key']
        console.log("S3 Object Name :", s3ObjectName)

    } catch (err) {
        console.log("Error parsing JSON string:", err)
    }

    //mark the object as in processing by changing its Tag into 'In Review'

    await sleep(1000)

    ///mark the object as in processing by changing its Tag into 'Reviewed'

    console.log('Move ConsumerObject : Scan finished!')


    console.log('Move ConsumerObject : Copying the object to the destination bouquet !')

    //copy object parameters
    let params = {
        Bucket: bucket,
        CopySource: bucket+'/'+oldDirName+'/filename.txt',
        Key: newDirName+'/filename.txt',
    };

    s3.copyObject(params, function(err, data) {
        if (err) {
            console.log("Error while moving Object :", err, err.stack)
        } else {
            console.log("Object has been successfully moved! ")
        }
    })

    //delete Object in the Upload bucket

    await sleep(1000)
    console.log('Move ConsumerObject : Copy completed!')
}