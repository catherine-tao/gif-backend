const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

// router.patch("/:actionType/:gifId", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (
//       user &&
//       req.params.actionType == "favorite" &&
//       !user.favorites.includes(req.params.gifId)
//     ) {
//       let currentFavorites = user.favorites;
//       currentFavorites.push(req.params.gifId);
//       const q = await User.updateOne(
//         { email: req.body.email },
//         { favorites: currentFavorites },
//         { new: true }
//       );
//       res.json({
//         message: "success",
//         user: user,
//         fav: req.body.favorites,
//         pass: req.body.password,
//         q: q,
//         currentFavorites: currentFavorites,
//       });
//     } else {
//       res.json({
//         message: "can't add fave",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       error: err,
//     });
//   }
// });

//FAVOURITE
router.patch("/favorite/:gifId", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ email: decoded.email });
    if (user && !user.favorites.includes(req.params.gifId)) {
      let currentFavorites = user.favorites;
      currentFavorites.unshift(req.params.gifId);
      const q = await User.updateOne(
        { email: req.body.email },
        { favorites: currentFavorites },
        { new: true }
      );
      res.json({
        message: "success",
        user: user,
        fav: req.body.favorites,
        pass: req.body.password,
        q: q,
        currentFavorites: currentFavorites,
      });
    } else {
      res.json({
        message: "can't add fave",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

//UNFAVOURITE
router.patch("/unfavorite/:gifId", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      let currentFavorites = user.favorites;
      const removedUnfavoritedGif = currentFavorites.filter(
        (gifId) => gifId !== req.params.gifId
      );
      const q = await User.updateOne(
        { email: req.body.email },
        { favorites: removedUnfavoritedGif },
        { new: true }
      );
      res.json({
        message: "success",
        user: user,
        fav: req.body.favorites,
        pass: req.body.password,
        q: q,
        currentFavorites: currentFavorites,
      });
    } else {
      res.json({
        message: "can't add fave",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

//USED
router.patch("/used/:gifId", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const gifIdArr = user.usedGifs.map((gifData) => {
        return gifData.gifId;
      });

      //if this is the first time they've used this gif
      if (!gifIdArr.includes(req.params.gifId)) {
        let currentUsedGifs = user.usedGifs;
        currentUsedGifs.unshift({
          gifId: req.params.gifId,
          timesUsed: 1,
          dateUsed: new Date(),
        });

        const q = await User.updateOne(
          { email: req.body.email },
          { usedGifs: currentUsedGifs },
          { new: true }
        );

        res.json({
          message: "success",
          user: user,
          q: q,
          gifIdArr: gifIdArr,
        });
      } else {
        const index = gifIdArr.indexOf(req.params.gifId);
        let usedGifUpdatedInfo = user.usedGifs[index];
        usedGifUpdatedInfo.timesUsed = Number(usedGifUpdatedInfo.timesUsed) + 1;
        usedGifUpdatedInfo.dateUsed = new Date();

        const updatedUsedGif = user.usedGifs.filter(
          (gif) => gif.gifId !== req.params.gifId
        );
        updatedUsedGif.unshift(usedGifUpdatedInfo);

        const q = await User.updateOne(
          { email: req.body.email },
          { usedGifs: updatedUsedGif },
          { new: true }
        );
        res.json({
          message: "success",
          user: user,
          q: q,
        });
      }
    } else {
      res.json({
        message: "can't handle use",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

//UNUSED
router.patch("/unused/:gifId", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const gifIdArr = user.usedGifs.map((gifData) => {
        return gifData.gifId;
      });

      const index = gifIdArr.indexOf(req.params.gifId);
      let usedGifUpdatedInfo = user.usedGifs[index];
      usedGifUpdatedInfo.timesUsed = Number(usedGifUpdatedInfo.timesUsed) - 1;
      usedGifUpdatedInfo.dateUsed = new Date();

      const updatedUsedGif = user.usedGifs.filter(
        (gif) => gif.gifId !== req.params.gifId
      );
      updatedUsedGif.unshift(usedGifUpdatedInfo);

      const q = await User.updateOne(
        { email: req.body.email },
        { usedGifs: updatedUsedGif },
        { new: true }
      );
      res.json({
        message: "success",
        user: user,
        q: q,
      });
    } else {
      res.json({
        message: "can't handle unused button click",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json({
        currentFavorites: user.favorites,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
