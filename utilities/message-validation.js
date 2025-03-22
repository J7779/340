const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};


validate.sendMessageRules = () => {
  return [

    body("message_to")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Recipient missing")
      .isNumeric({min: 0})
      .withMessage("Please select a valid recipient"), 


    body("message_subject")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Message subject is missing or invalid"), 


    body("message_body")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Message body is missing or invalid."),
  ];
};


validate.checkMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const recipientData = await accountModel.getAccountList();
        const recipientList = utilities.buildRecipientList(
          recipientData,
          message_to
        );
        res.locals.Subject = message_subject;
        res.locals.Body = message_body;
        res.render("message/compose", {
            errors,
            title: "Compose",
            nav,
            message_to,
            message_subject,
            message_body,
            recipientList,
        });
        return;
    }
    next();
};

module.exports = validate;