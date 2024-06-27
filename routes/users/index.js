//Initialize libraries
var express = require("express");

module.exports = function (passport) {
  //Router
  var router = express.Router();

  //Load Modules
  var UserController = require("../../modules/user");

  // Validations
  var validateRegisterInput = require("../../validation/register");
  var validateLoginInput = require("../../validation/login");



  // @route POST api/users/signup
  // @desc Login user and return JWT token
  // @access Public
  router.post("/signup", (req, res) => {
    //Do validations here

    UserController.register(req.body)
      .then((result) => {
        console.log("user registration route", result);

        return res.status(200).json({
          message: "user registration successful ",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  router.post("/login", (req, res) => {
    //Do validations here

    UserController.userLogin(req.body)
      .then((result) => {
        console.log("user login route", result);

        return res.status(200).json({
          message: "user login successful ",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route PUT /users/legal
  // @access Public

  // router.put("/legal", (req, res) => {
  //   //Do validations here

  //   UserController.acceptLegal(req.body)
  //     .then((result) => {
  //       console.log("Accept Legal", result);

  //       return res.status(200).json({
  //         message: "Update Accept Legal successfully",
  //         data: result,
  //       });
  //     })
  //     .catch((e) => {
  //       return res.status(400).json({ e });
  //     });
  // });

  router.delete("/deactivation", (req, res) => {
    console.log("Account deactivate request", req.body);

    UserController.deleteUser(req.body)
      .then((result) => {
        console.log("User Deactivate result", result);

        return res.status(200).json({
          message: "Account deactivation successful",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  return router;
};
