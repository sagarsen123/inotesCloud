const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const fetchuser = require("../middleware/fetcfhuser");
const Note = require("../models/Note");

//Route 1 : Get all the notes using : get "/api/auth/getuser". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

//Route 2 :  Add a new Note using Post "/api/auth/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body(
      "description",
      "Description must be atleast 5 characters long"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //array destructuring from req.body
      const { title, description, tag } = req.body;

      const errors = validationResult(req);

      // if there are errors return bad request and errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = await Note.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "internal server error" });
    }
  }
);

//Route 3: Update an existing Note using PUT "api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) res.status(404).send("not Found");

    if (note.user.toString() !== req.user.id) {
      return req.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

//route 4:   Delete a note by delete request DELETE : "api/notes/deletenote" . Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // find the note to be updated and delete i t
    let note = await Note.findById(req.params.id);
    if (!note)return res.status(404).send("not Found");

    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return req.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been Deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
