//Initialize Libraries
var jwt = require("jsonwebtoken");
//Initialize Models
var User = require("../models/User");
var Profile = require("../models/Profile");
var ActivityLog = require("../models/ActivityLog");
const keys = require("../config/keys");
const sha256 = require('sha256');


// Define user signup Module
exports.register = (body) => {
  return new Promise((resolve, reject) => {

    User.findOne({ email: body.email }).then((user) => {
      if (user) {
        reject({ "error": "Username already exists" });
      } else {
        var newUser = new User({
          email: body.email,
          password: sha256(body.password),
        });

        newUser
          .save()
          .then((user) => {

            Profile.findOne({ user_id: user._id, is_active: { $ne: 3 } }).then((profile) => {
              console.log("profile", profile);
              if (!profile) {
                var newProfile = new Profile({
                  user_id: user._id,
                  fullname: body.name,
                  email: body.email
                });

                newProfile
                  .save()
                  .then((profile) => {
                    User.findOneAndUpdate(
                      { email: body.email },
                      { $push: { profiles: profile._id } },
                      { new: true }
                    )
                      .then((user) => {
                        var payload = {
                          user_id: user.id,
                          profile_id: profile._id,
                          email: user.email,
                          mobile: user.mobile,
                          fullname: profile.fullname,
                          profiles: user.profiles,
                          profile_id: profile._id,
                          profile_pic: profile.profile_pic,
                          acceptTOS: user.acceptTOS,
                          acceptPP: user.acceptPP
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
                      })
                      .catch((err) => {
                        return reject(err);
                      });
                  })
                  .catch((err) => reject(err));
              } else {
                //profile exists

                var payload = {
                  user_id: user.id,
                  email: profile.email,
                  mobile: user.mobile,
                  fullname: profile.fullname,
                  profiles: user.profiles,
                  profile_id: profile._id,
                  profile_pic: profile.profile_pic,
                  acceptTOS: user.acceptTOS,
                  acceptPP: user.acceptPP
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
              }
            });
          })
          .catch(err => reject(err));
      }
    })

  });
}

// Define user login Module
exports.userLogin = (body) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: body.email, password: sha256(body.password) }).then((user) => {
      console.log("user", user);
      if (user) {
        Profile.findOne({ email: body.email, user_id: user._id }).then((profile) => {
          console.log("Authentication success")
          var payload = {
            user_id: user.id,
            profile_id: profile._id,
            email: profile.email,
            mobile: user.mobile,
            fullname: profile.fullname,
            profiles: user.profiles,
            profile_type: profile.profile_type,
            profile_pic: profile.profile_pic,
            acceptTOS: user.acceptTOS,
            acceptPP: user.acceptPP
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds //parse from config
            },
            (err, token) => {
              return resolve({
                token: token,
              });
            }
          );
        }).catch((err) => {
          reject(err);
        })

      }
      else {
        reject("Username and password don't match");
      }
    }).catch((err) => {
      reject(err)
    })

  });
}

//Define User accept Legal Module
// exports.acceptLegal = (body) => {
//   console.log("recv request for marking legal", body);
//   // return User.register(body);

//   return new Promise((resolve, reject) => {
//     User.findOne({ _id: body.user_id })
//       .then((user) => {
//         if (!user) {
//           reject({ error: "Account doesn't exists" });
//         } else {
//           var tosActivityLog = new ActivityLog({
//             user_id: body.user_id,
//             event_type: "Accept Terms of Services",
//             event_description: body.tos_content,
//             event_design: body.tos_version,
//           });

//           var ppActivityLog = new ActivityLog({
//             user_id: body.user_id,
//             event_type: "Accept Privacy Policy",
//             event_description: body.pp_content,
//             event_design: body.pp_version,
//           });

//           // if(body.acceptedTOS) {
//           user.acceptTOS = 1;
//           user.acceptPP = 1;
//           // }
//           // else {
//           //     newActivityLog.event_description = 'Didn\'t Accept Terms of Service';
//           //     user.acceptTOS = 0;
//           // }
//           tosActivityLog
//             .save()
//             .then((tosactivityLog) => {
//               ppActivityLog
//                 .save()
//                 .then((ppactivityLog) => {
//                   user
//                     .save()
//                     .then((user) => {
//                       Profile.findOne({ user_id: user._id }).then((profile) => {
//                         if (!profile) {
//                           return reject('Profile does not exist');
//                         }
//                         else {
//                           var payload = {
//                             user_id: user.id,
//                             profile_id: profile._id,
//                             email: profile.email,
//                             mobile: user.mobile,
//                             fullname: profile.fullname,
//                             profiles: user.profiles,
//                             profile_type: profile.profile_type,
//                             profile_pic: profile.profile_pic,
//                             acceptTOS: user.acceptTOS,
//                             acceptPP: user.acceptPP
//                           };
//                           // Sign token
//                           jwt.sign(
//                             payload,
//                             keys.secretOrKey,
//                             {
//                               expiresIn: 31556926 // 1 year in seconds //parse from config
//                             },
//                             (err, token) => {
//                               return resolve({
//                                 token: token,
//                               });
//                             }
//                           );
//                         }
//                       }).catch((err) => {
//                         reject(err);
//                       })
//                     })
//                     .catch((err) => reject(err));
//                 })
//                 .catch((err) => reject(err));
//             })
//             .catch((err) => reject(err));
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };


// Define user deactivate Module
exports.deleteUser = (body) => {
  return new Promise((resolve, reject) => {

    User.findOne({ mobile: body.mobile }).then((user) => {

      if (user) {

        let mobile = user.mobile;
        let currtimeStamp = new Date().getTime();
        let deleted_mobile = `${mobile}_deleted_${currtimeStamp}`;

        User.findOneAndUpdate(
          { mobile: body.mobile },
          {
            mobile: deleted_mobile,
            is_active: 3,
            confirmOtp: null,
          },
          { new: true }
        ).then((result) => {
          console.log("result", result);
          resolve(result);
        }).catch((err) => {
          return reject(err);
        });


      } else {
        reject("User not found")
      }
    }).catch((err) => reject(err));

  });
}