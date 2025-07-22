const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//  ROUTE 1 : GET allthe notes detail using: GET "/api/notes/getuser ".login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})

//  ROUTE 2 : add a new notes detail using: POST "/api/notes/addnote ".login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid tittle').isLength({ min: 3 }),
    body('description', 'description at least must be atleast 5 characters ').isLength({ min: 5 }),], async (req, res) => {
        try {


            const { title, description, tag } = req.body;
            // if there r errors return BAD request and the errors

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()
            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("some error occured");
        }

    })
//  ROUTE 3 : update an existing note using: PUT "/api/notes/updatenote ".login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        // create a newNote object 
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("not found ") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("mai tujhe allow hi nhi ker rha hu ");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})

//  ROUTE 4 : delete an existing note using: DELETE "/api/notes/deletenote ".login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    //const { title, description, tag } = req.body;
    try {


        //find the note to be deleted and delete it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("not found ") }

        // allow deletion only if user owns this note 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("mai tujhe allow hi nhi ker rha hu ");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success ": "note has been deleted", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})
module.exports = router