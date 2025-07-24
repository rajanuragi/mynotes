import { useState } from "react";
import NoteContext from "./notes/noteContext";

export const NoteState = (props) => {
    const host = "http://localhost:5000"
    let notesInitial = []

    const [notes, setNotes] = useState(notesInitial)


    // get all note 
    const getNotes = async () => {
        //api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },

        });
        const json = await response.json()
        setNotes(json)

    }
    // add a note 
    const addNote = async (title, description, tag) => {
        // todo API call
        //api call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        setNotes(notes.concat(notes))

    
    }
    // delete a note 
    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }

        });
        const json = response.json();
        console.log(json)

        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)

    }

    // edit a note 
    const editNote = async (id, title, description, tag) => {
        //api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })

        });
        const json = await response.json();
        console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        //logic to edit in client 
        for (let index = 0; index < notes.length; index++) {
            const element = newNotes[index];
            if (element.id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
            }
            break;
        }
        console.log(id, newNotes);
        setNotes(newNotes);
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )

}
export default NoteState;