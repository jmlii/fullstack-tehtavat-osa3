const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

morgan.token('post-data', (request, response) => {
  if (request.method === "POST") {
    return (JSON.stringify(request.body))
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook found on subsites...</h1>')
})

app.get('/api/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return (
    Math.floor(Math.random()*95 + 5)
  )
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number missing.' 
    })
  }
  if (persons.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'Name already exists in the phonebook'
    })
  }
  
  const person = {
    id: generateId(),    
    name: body.name,
    number: body.number,
  }
  
  persons = persons.concat(person)
  console.log(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)