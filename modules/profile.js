//Initialize Libraries
var jwt = require("jsonwebtoken");
var AWS = require("aws-sdk"),
  fs = require("fs");

//Initialize Models
var User = require("../models/User");
var Profile = require("../models/Profile");
const keys = require("../config/keys");


exports.uploadImage = (file, profile_id) => {
  return new Promise((resolve, reject) => {
    console.log("", keys.accessKeyId, keys.secretAccessKey, keys.bucket);

    let s3bucket = new AWS.S3({
      accessKeyId: keys.accessKeyId,
      secretAccessKey: keys.secretAccessKey,
      Bucket: keys.bucket,
      region: keys.region,
      apiVersion: "2006-03-01",
    });

    // s3bucket.createBucket(function () {
    let BucketPath = "uploads";
    //Where you want to store your file
    var ResponseData = [];

    // file.map((item) => {
    var params = {
      Bucket: keys.bucket,
      Key: "uploads/" + profile_id + "/" + profile_id + ".jpg",
      Body: file.buffer,
      ACL: "public-read",
    };

    Profile.findOne({ _id: profile_id, is_active: { $ne: 3 } }).then((profile) => {
      // Check if profile mobile
      if (!profile) {
        // return res.status(404).json({ emailnotfound: "Email not found" });
        reject({ error: "Profile not found" });
      }
      s3bucket.upload(params, function (err, data) {
        console.log("data,err", data, err);
        if (err) reject(err);

        if (profile) {
          // Save profile.
          // profile
          //   .save()
          //   .then((profile) => resolve(profile))
          //   .catch((err) => reject(err));
          Profile.findOneAndUpdate(
            { _id: profile_id, is_active: { $ne: 3 } },
            { $set: { profile_pic: data.Location } },
            { new: true }
          )
            .then((profile) => {
              resolve(profile);
            })
            .catch((err) => reject(err));
        } else {
          reject({ error: "Error uploading profile photo" });
        }
      });
    });
  });
};

//Profile update

exports.update = (body, decodedBody) => {
  // return User.register(body);
  console.log("profile details update", body, decodedBody);

  return new Promise((resolve, reject) => {
    Profile.findOne({ _id: decodedBody.profile_id, user_id: decodedBody.user_id, is_active: { $ne: 3 } }).then(
      (profile) => {
        console.log("profile update called");
        // body.sp_geo.geohash = Geohash.encode(body.sp_geo.lat, body.sp_geo.lng);
        if (profile) {
          var newProfile = {
            fullname: body.fullname,
            email: body.email,
            mobile: body.mobile, //Not required
            address: body.address,

            school: {
              school_type:
                body.school && body.school.school_type
                  ? body.school.school_type
                  : "",
              school_name:
                body.school && body.school.school_name
                  ? body.school.school_name
                  : "",
              school_branch:
                body.school && body.school.school_branch
                  ? body.school.school_branch
                  : "",
              school_pin_code:
                body.school && body.school.school_pin_code
                  ? body.school.school_pin_code
                  : "",
              name: body.school && body.school.name ? body.school.name : "",
              phone: body.school && body.school.phone ? body.school.phone : "",
            },
            gender: body.gender,
          };

          console.log("new Profile obj on update", newProfile);

          Profile.findOneAndUpdate({ _id: decodedBody.profile_id, is_active: { $ne: 3 } }, newProfile, {
            new: true,
          })
            .then((result) => {
              User.findOne({ _id: decodedBody.user_id })
                .then((user) => {
                  // resolve(user)
                  var payload = {
                    user_id: user.id,
                    profile_id: result._id,
                    email: result.email,
                    mobile: user.mobile,
                    fullname: result.fullname,
                    profiles: user.profiles,
                    // role: profile.roles[0],
                    profile_type: result.profile_type,
                    profile_pic: result.profile_pic,
                    address: result.address,
                    school: result.school,
                    acceptTOS: user.acceptTOS,
                    acceptPP: user.acceptPP,
                    class_subject: result.class_subject,
                    // video_skipped: user.video_skipped,
                    video_watched: result.video_watched,
                    // mySp: user.mySp,
                  };
                  // Sign token
                  jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                      expiresIn: 31556952, // 1 year in seconds //parse from config
                    },
                    (err, token) => {
                      return resolve({
                        token: token,
                      });
                    }
                  );

                  // resolve(profile)
                })
                .catch((err) => {
                  return reject(err);
                });
            })
            .catch((err) => reject(err));
        } else {
          reject({ error: "You don't have a profile registered" });
        }
      }
    );
  });
};

//Profile details fetch

exports.getDetails = (body) => {
  // return User.register(body);
  console.log("body in get ProfileDetails", body);

  return new Promise((resolve, reject) => {
    Profile.findOne({ _id: body.profile_id, is_active: { $ne: 3 } })
      .cache({ expire: 10 })
      .then((profile) => {
        console.log("profile details called");
        // body.sp_geo.geohash = Geohash.encode(body.sp_geo.lat, body.sp_geo.lng);
        if (profile) {
          resolve(profile);
        } else {
          reject({ error: "You don't have a profile registered" });
        }
      });
  });
};



exports.deleteProfileImage = (body, decodedBody) => {
  console.log("body in delete profile image", body);

  return new Promise((resolve, reject) => {
    Profile.findOneAndUpdate(
      { _id: decodedBody.profile_id, is_active: { $ne: 3 } },
      { $set: { profile_pic: null } },
      { new: true }
    ).then((profile) => {
      console.log("delete profile image function called");
      if (profile) {
        resolve(profile);
      } else {
        reject({ error: "You don't have a profile registered" });
      }
    });
  });
};
