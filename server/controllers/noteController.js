const express = require('express')
const Notes = require('../models/noteModel')
const jwtMiddleware = require('../middlewares/authMiddleware')

//get Notes
exports.getNotes = async (req,res)=>{
    try{
        const notes = await Notes.find({createdBy : req.user._id})
        res.json(notes)
    }catch(err){
        console.log("error...", err)
        res.status(500).json("server error")
    }
}

//create Note - post

exports.createNote = async (req,res)=>{
    const {title, description} = req.body

    try{
        if(!title || !description){
            return res.status(400).json({message : "Please fill all fields..."})
        }

        const newNote = Notes({
            title,
            description,
            createdBy : req.user._id
        })
        await newNote.save()
        res.status(200).json(newNote)
    }catch(err){
        res.status(500).json({message : "Server error..."})
    }

}


//getNote by Id -get

exports.getNotesById = async (req,res)=>{
    try{    
        const note = await Notes.findById(req.params.id)
        if(!note){
            res.status(404).json({message : "note not found"})
        }
    }catch(err){
        res.status(500).json({message : "server error"})
    }
}

//Update Note -put

exports.updateNote = async (req, res) => {
  const { title, description } = req.body;

  try {
    // ✅ Find note by its ID, not the user's ID
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // ✅ Check if the logged-in user owns this note
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Update the fields if provided
    note.title = title || note.title;
    note.description = description || note.description;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a note
exports.deleteNote = async (req,res)=>{
    try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await note.deleteOne();
    res.json({ message: "Note was deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}