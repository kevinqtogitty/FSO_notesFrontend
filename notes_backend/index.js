const express = require('express');
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors({origin: "http://localhost:5174"}))

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        date: '2022-05-30T17:30:31.0982',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only Javascript',
        date: '2022-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2022-05-30T19:20:14.298Z',
        important: true
    }
]

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
    
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.param.id)
  notes = notes.filter(note => note.id !==id)

  response. status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => notes.id)) : 0
  return maxId + 1

}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(404).json({
      error: 'content missins'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  note = notes.concat(note)

  response.json(note)
})
  
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})