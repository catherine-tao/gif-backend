const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

//signup
router.post("/", async (req, res) => {

  // Joi.validate(data, schema, (err, value) => {
  //   if (err) {
  //     //console.log("error", signupError)

  //     return res.status(400).json({
  //       error: signupError.details[0].message,
  //     });
  //   }
  // });

  try {
    const user = await User.find({ email: req.body.email });
    console.log(user);
    if (user.length > 0) {
      return res.status(409).json({
        message: "This email is already signed up",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({
      ...req.body,
      password: hashPassword,
      favourites: [],
    }).save();

    res.status(201).json({
      message: "New user created",
      userCreated: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  console.log(users);
  res.json(users);
});

module.exports = router;
