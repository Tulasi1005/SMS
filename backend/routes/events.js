const express = require("express");
const router = express.Router();
const Event = require("../models/eventModel");
const Announcement = require("../models/announceModel");
const authMiddleware = require("../middleware/auth"); // Adjust path as needed
const cors = require('cors')

router.use(express.json()); // Ensure JSON parsing
router.use(cors()); // Already included, but ensure CORS is configured in main app if needed

// GET all events (Authenticated)
router.get("/events", authMiddleware, async (req, res) => {
  try {
    // Optionally filter events by branchId for non-admins
    const query = req.user.role === "admin" ? {} : { branchId: req.user.branchId };
    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    // console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// POST a new event (Authenticated, Principal only)
router.post("/events", authMiddleware, async (req, res) => {
  try {
    const { name, type, date, img, volunteers, participants } = req.body;

    if (!name || !type || !date) {
      return res.status(400).json({ message: "Name, Type, and Date are required." });
    }

    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can create events" });
    }

    const newEvent = new Event({
      name,
      type,
      date,
      img,
      volunteers,
      participants,
      branchId: req.user.branchId, // From JWT
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    // console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT to update an event (Authenticated, Principal only)
router.put("/events/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can update events" });
    }

    const { name, type, date, img, volunteers, participants } = req.body;
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, branchId: req.user.branchId }, // Ensure principal owns the event
      { name, type, date, img, volunteers, participants, branchId: req.user.branchId },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found or you don’t have permission" });
    }

    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    // console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE an event (Authenticated, Principal only)
router.delete("/events/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can delete events" });
    }

    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      branchId: req.user.branchId, // Ensure principal owns the event
    });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found or you don’t have permission" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    // console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// GET all announcements (Authenticated)
router.get("/announcements", authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { branchId: req.user.branchId };
    const announcements = await Announcement.find(query);
    res.json(announcements);
  } catch (error) {
    // console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Error fetching announcements", error });
  }
});

// POST a new announcement (Authenticated, Principal only)
router.post("/announcements", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can create announcements" });
    }

    const { title, message, announcementDate } = req.body;
    const newAnnouncement = new Announcement({
      title,
      message,
      announcementDate,
      branchId: req.user.branchId, // From JWT
    });
    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement added successfully" });
  } catch (error) {
    // console.error("Error adding announcement:", error);
    res.status(500).json({ message: "Error adding announcement", error });
  }
});

// PUT to update an announcement (Authenticated, Principal only)
router.put("/announcements/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can update announcements" });
    }

    const updatedAnnouncement = await Announcement.findOneAndUpdate(
      { _id: req.params.id, branchId: req.user.branchId },
      req.body,
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found or you don’t have permission" });
    }

    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    // console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Error updating announcement" });
  }
});

// DELETE an announcement (Authenticated, Principal only)
router.delete("/announcements/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Only principals can delete announcements" });
    }

    const deletedAnnouncement = await Announcement.findOneAndDelete({
      _id: req.params.id,
      branchId: req.user.branchId,
    });

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found or you don’t have permission" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    // console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Error deleting announcement" });
  }
});

module.exports = router;