// const for title, text, button and note-list
const title = document.getElementById("noteTitle")
const text = document.getElementById("textContent")
const noteForm = document.getElementById("noteBox")
const noteList = document.getElementById("containerNotes")
const saveButton = document.getElementById("saveBtn")
const cancelButton = document.getElementById("cancelBtn")

let notes = []
let noteId = null

document.addEventListener("DOMContentLoaded", loadNote)
noteForm.addEventListener("submit", formSubmit)
cancelButton.addEventListener("click", cancelNote)

function loadNote() {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
        notes = JSON.parse(savedNotes)
    } 
    render()
}

function render() {
    noteList.innerHTML = ""
    if (notes.length === 0) {
        noteList.innerHTML = `
            <div class="emptyNotes">
                <i class="fa-solid fa-note-sticky"></i>
                <p>Oops! It looks like you don't have any notes yet.</p>
            </div>
        `
        return
    }

    notes.forEach((note) => {
        const note_elem = document.createElement("div")
        const longText = note.text.length > 100
        note_elem.classList.add("note")
        note_elem.innerHTML = `
            <h2>${note.title}</h2>
            <small class="note-date"><i class="fa-regular fa-clock"></i> ${noteDatetime(note.noteDatetime)}</small>
            <p>${note.text}</p>
            <div class="actn">
                <button class="edit" onclick="editNote('${note.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete" onclick="deleteNote('${note.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `
        noteList.appendChild(note_elem)
    })
}

function saveNotetoLS() {
    localStorage.setItem("notes", JSON.stringify(notes))
}

function editNote(id) {
    noteId = id
    const note = notes.find((note) => note.id === id)
    title.value = note.title
    text.value = note.text
    saveButton.textContent = "Update"
    cancelButton.style.display = "inline-block"
}

function cancelNote() {
    noteId = null
    title.value = ""
    text.value = ""
    saveButton.textContent = "Add note"
    cancelButton.style.display = "none"
}

function deleteNote(id) {
    if (confirm("Are you sure you want to delete this note?")){
        notes = notes.filter((note) => note.id !== id)
        saveNotetoLS()
        render()
    }
}

function noteDatetime(dateString) {
    const date = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }
    return new Date(dateString).toLocaleString("en-US", date)
}

function formSubmit(e) {
    e.preventDefault()
    const note_title = title.value.trim()
    const note_text = text.value.trim()
    if (!note_title || !note_text) {
        alert("Please enter a title and text for your note")
        return
    }
    if (noteId) {
        const noteIdx = notes.findIndex((note) => note.id === noteId)

    if (noteIdx !== -1) {
        notes[noteIdx] = {
            id: noteId,
            title: note_title,
            text: note_text,
            noteDatetime: notes[noteIdx].noteDatetime,
            updateDatetime: new Date().toISOString(), // after editing note
        }
    }
        noteId = null
        saveButton.textContent = "Add Note"
        cancelButton.style.display = "none"
    } else {
        const newNote = {
        id: Date.now().toString(),
        title: note_title,
        text: note_text,
        noteDatetime: new Date().toISOString(),
        updateDatetime: new Date().toISOString(),
        }
        notes.push(newNote)
    }

    saveNotetoLS()
    title.value = ""
    text.value = ""
    render()
}