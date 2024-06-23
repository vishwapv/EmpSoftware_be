//Initialize libraries
var express = require("express");
var multer = require("multer");
const verifyToken = require("../../verifyToken/index");

var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

var uploadSingle = multer({ storage: storage }).single("file");


module.exports = function (passport) {

  //Router
  var router = express.Router();
  router.use('*', verifyToken);

  //Load Modules
  var ProfileController = require("../../modules/profile");

  /**
   **@route POST scid/uploadImage
   **@desc Register Establishment
   **@access Public
   **/

  router.put("/:profile_id/photo/update", uploadSingle, (req, res) => {
    const profile_id = req.params.profile_id;
    const file = req.file;
    console.log(profile_id, file);
    ProfileController.uploadImage(file, profile_id)
      .then((result) => {
        console.log("res", result);

        return res.status(200).json({
          message: "Image successfully uploaded",
          data: result,
        }); //Return User
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ e }); //Return Error
      });
  });

  /**
  **@route PUT profile/update
  **@desc Update profile
  **@access Public
  **/

  router.put("/update", (req, res) => {
    console.log("update profile", req);

    ProfileController.update(req.body, req.decodedBody)
      .then((result) => {
        console.log("res", result);

        return res.status(200).json({
          message: "Account successfully updated",
          data: result,
        }); //Return User
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ e }); //Return Error
      });
  });

  /**
   **@route POST profile/update
   **@desc Update profile
   **@access Public
   **/

  router.get("/details", (req, res) => {
    console.log("fetching profile details", req.decodedBody);

    ProfileController.getDetails(req.decodedBody)
      .then((result) => {
        console.log("res", result);

        return res.status(200).json({
          message: "Profile Successfully fetched",
          data: result,
        }); //Return User
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ e }); //Return Error
      });
  });

  /**
   **@route POST profile/image/delete
   **@desc remove profile image
   **@access Public
   **/

  router.delete("/image/delete", (req, res) => {
    console.log("remove profile image", req);

    ProfileController.deleteProfileImage(req.body, req.decodedBody)
      .then((result) => {
        console.log("res", result);

        return res.status(200).json({
          message: "Profile Image Successfully removed",
          data: result,
        }); //Return User
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ e }); //Return Error
      });
  });

  return router;


};
