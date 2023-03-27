'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function setObjectTagging(s3ObjectName, key, value) {
    let params = {
        Bucket: process.env.CustomerDocumentsBucket,
        Key: s3ObjectName,
        Tagging: {
            TagSet: [
                {
                    Key: key,
                    Value: value
                }
            ]
        }
    };

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObjectTagging-property
    //https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectTagging.html
    s3.putObjectTagging(params, function(err, data) {
        if (err) {
            console.log("Error while tagging Object:", err, err.stack)
        } else {
            console.log("Object has been successfully tagged !")
        }
    })
}

function copyObject(s3ObjectName, sourceBucket, destinationBucket) {
    //copy object parameters
    //TODO: here we can use Directories to separate customers - we ca read it from the input
    // process.env.UploadBucket +'/'+oldDirName+'/filename.txt'
    let params = {
        Bucket: destinationBucket,
        CopySource: sourceBucket + '/' + s3ObjectName,
        Key: s3ObjectName
    };

    s3.copyObject(params, function(err, data) {
        if (err) {
            console.log("Error while coping Object :", err, err.stack)
        } else {
            console.log("Object has been successfully copied! ")
        }
    })
}

function deleteObject(s3ObjectName, fromBucket) {
    let params = {
        Bucket: fromBucket,
        Key: s3ObjectName
    };

    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log("Error while deleting Object :", err, err.stack)
        } else {
            console.log("Object has been successfully deleted! ")
        }
    })
}



// The Lambda handler
exports.handler = async (event) => {
    console.log('Move ConsumerObject function starts v4: ')
    console.log(JSON.stringify(event, 2, null))


    console.log('Start scanning the object!')

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
    // setObjectTagging(s3ObjectName, "Security-Check", "In Review")

    await sleep(500)

    ///mark the object as in processing by changing its Tag into 'Reviewed'
    // setObjectTagging(s3ObjectName, "Security-Check", "Reviewed")


    console.log('Scan finished!')



    console.log('Moving the object to the destination bucket !')

    copyObject(s3ObjectName,
               process.env.UploadBucket,
               process.env.CustomerDocumentsBucket)

    await sleep(100)

    //delete Object in the Upload bucket
    deleteObject(s3ObjectName, process.env.UploadBucket)

    console.log('Object has been moved!')


    await sleep(100)
    console.log('Move ConsumerObject function ends v4: ')
}