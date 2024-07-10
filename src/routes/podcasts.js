const PodcastModel = require("../models/Podcasts");
const express = require("express");
const UserModel = require("../models/Users");
const podcastsRouter = express.Router();

// GET
podcastsRouter.get("/", (req, res) => {
  PodcastModel.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

// POST
podcastsRouter.post("/", (req, res) => {
  const podcast = new PodcastModel(req.body);

  podcast
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

// PUT
podcastsRouter.put("/", async (req, res) => {
  try {
    const podcast = await PodcastModel.findById(req.body.podcastID);
    const user = await UserModel.findById(req.body.userID);
    user.savedPodcasts.push(podcast);
    await user.save();
    res.json({ savedPodcasts: user.savedPodcasts });
  } catch (err) {
    console.error(err);
  }
});

podcastsRouter.get("/savedpodcasts/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedPodcasts: user?.savedPodcasts });
  } catch (error) {
    res.json(error);
  }
});

podcastsRouter.get("/savedpodcasts/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedPodcasts = await PodcastModel.find({
      _id: { $in: user.savedPodcasts },
    });
    res.json({ savedPodcasts });
  } catch (error) {
    res.json(error);
  }
});

// DELETE
podcastsRouter.delete("/:podcastID/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const podcast = await PodcastModel.findById(req.params.podcastID);
    //user.savedPodcasts.remove({ savedPodcasts: podcast });
    user.savedPodcasts = user.savedPodcasts.filter(
      (savedPodcastID) => savedPodcastID.toString() !== podcast._id.toString()
    );

    await user.save();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});


// delete podcast from server
podcastsRouter.delete("/delete-podcasts/:podcastID/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const podcast = await PodcastModel.findByIdAndDelete(req.params.podcastID);

    user.savedPodcasts = user.savedPodcasts.filter(
      (savedPodcastID) => savedPodcastID.toString() !== podcast._id.toString()
    );

    await user.save();
    res.json(podcast);
  } catch (error) {
    res.json(error);
  }
});

// Update
// Update podcast details
podcastsRouter.put("/:podcastID", async (req, res) => {
  try {
    const { title, genre, description, link } = req.body;

    const updatedPodcast = await PodcastModel.findByIdAndUpdate(
      req.params.podcastID,
      { title, genre, description, link },
      { new: true, runValidators: true }
    );

    if (!updatedPodcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    res.json({ message: "Podcast updated successfully", podcast: updatedPodcast });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = podcastsRouter;
