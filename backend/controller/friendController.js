var Friend = require("../models/friend");
var User = require("../models/user");

exports.listAllFriends = (req, res) => {
  Friend.find({}, (err, friend) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(friend);
  });
};

exports.updateFriend = (req, res) => {
  Friend.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, friend) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(friend);
    }
  );
};

exports.deleteFriend = async (req, res) => {
  await Friend.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Friend successfully deleted" });
  });
};

exports.createNewFriend = (req, res) => {
  let newFriend = new Friend(req.body);
  newFriend.save((err, friend) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(friend);
  });
};

exports.listAllSuggestions = (req, res) => {
  User.find({}, (err, friend) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(friend);
  });
};