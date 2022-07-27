import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './Notes'
import notesService from './src/services/notesService.jsx' 
import Notification from './Notification.jsx'
import Footer from './footer.jsx'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  //useEffect is used on load because we can do two things at once.
  //1. Look above, the states are first intialized onpageload and we can use useEffect hook to fetch data at the SAME time
  //2. Initialize a function variable that GET request to the server, pass in the JSON server url, 
  //   then use the setNotes function to store that data inside notes
  //3. You have to call the function immediatley if it is written in a function variable
  //4. To call the function use useEffect and pass in two parameters, the name of the function and an empty array with signals,
  //   that it has no dependencies

  useEffect(() => {             //useEffect runs on load and accesses the getAll function provided by notesService object
    notesService                //sets the notes to the intial values retrieved by the getAll method
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])


  // useEffect(hook, [])

  //When a not is added prevent the default action
  //1. create a new noteObject
  //2. use the axios POST method, pass in the the server URL, and the note object
  //3. then once we get a response we access the notes state and concat the new noteObject
  //   and reset the newNote handler to an empty string for the next note.
  const addNote = (e) => {
    e.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
    }

    notesService                                  //Adding a newNote calls create() from notesService and we return the newNote
      .create(noteObject)                         //concatonated to the notes state
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (e) => setNewNote(e.target.value)

  // If the toggle importance button is clicked execute this process
  // 1. take the id of the noteObject that triggered this call and declare a URL with the id, then use the .find method,
  //    to find the note with the matching id and store it in a new variable i.e. make a copy
  // 2. copy the rest of the properies of the copied note into an object using the spread operator and 
  //    specifically set the important property of this copy to the inverse of its original state (false -> true, vice versa)
  // 3. use the PUT request method to make the change to that object stored in the server. Pass in the url, and the changedNote,
  //    call the .then method (ALWAYS CALL AFTER THE FIRST REQUEST!), use the setNotes function to map through all the notes,
  //    if the note id of the CURRENT NOTE BEING MAPPED DOES NOT MATCH THE ID PASSED return the unchanged note. 
  //    IF IT DOES MATCH OR RETURN FALSE then return the changed note stored in reponse.data
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important : !note.important }


    notesService                                                              //Here we've moved the baseURl into the notesService file
      .update(id, changedNote)                                                //So we can just call update() and pass in the id, and changedNote
      .then(returnedNote => {                                                     //and we just have to handle the resolving actions.
        setNotes(notes.map(note => note.id !== id ? note : changedNote))
        console.log(notes)
      })
      .catch(error =>{
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input placeholder='Add a new note...' value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
