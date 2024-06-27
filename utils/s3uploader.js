var AWS = require("aws-sdk"),
  fs = require("fs");

exports.s3Uploader = (keys, file, inputObj, uploadtype) => {

  console.log("s3 uploader", keys, file, inputObj);
  return new Promise((resolve, reject) => {
    let s3bucket = new AWS.S3({
      accessKeyId: keys.accessKeyId,
      secretAccessKey: keys.secretAccessKey,
      Bucket: keys.bucket,
      region: keys.region,
      apiVersion: "2006-03-01",
    });

    var responseData = [];

    let file_arr = Array.isArray(file)?file:[file];

    file_arr.map((item) => {
      console.log("prep uploading to s3", item);
      var params = {
        Bucket: keys.bucket,
        Key:(`uploads/${inputObj.owner_id}/${inputObj.project_type}/${inputObj.project_id}/tp/${inputObj.taskConfig && inputObj.taskConfig.autobot_tp_id}/task/${inputObj._id}/${item.originalname}` ),
        Body: item.buffer,
        ACL: "public-read",
      };

      s3bucket.upload(params, function (err, data) {
        console.log("uploading to s3", data);

          if (err) reject(err);
  
          responseData.push(data);
          console.log('responseData', responseData);
          console.log('file_arr', file_arr);
          // if (responseData.length == file.length) { Check this condition
            resolve({
              error: false,
              Message: "script files uploaded successfully",
              response: responseData
            });
          // }
        });
    })
  }).catch((err)=> {
    console.log("reject(err)",(err));
    reject(err)
  });
};
