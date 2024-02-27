const express = require("express");
const router = express.Router();
const User = require("../model/user"); 
const usermodel = require("../model/user");

router.post("/register", async (req, res) => {
  const newUser = new User(req.body); 
  try {
    const savedUser = await newUser.save();
    res.send("User registered successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});


router.post('/login', async (request, response) => {
    const { email, password } = request.body;


    try {
        const user = await usermodel.findOne({ email, password });

        if (user) { response.json({ success: true, message: 'Login Successfully' }); }

        else { response.json({ success: false, message: 'Invalid Username and email' }); }
    }

    catch (error) { response.status(500).json({ sucess: false, message: 'Error' }) }
})



router.get('/getallusers', async (req, res) => {
    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;