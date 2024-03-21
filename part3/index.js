const express = require('express')
const app = express()

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        response.status(404).json({ Error: 'Not Found' })
    } else {
        response.json(person)
    }
})

app.get('/info', (request, response) => {
    let len = persons.length
    let currentTime = new Date();
    let formatTime = currentTime.toDateString() + ' ' + currentTime.toTimeString()
    let message = `<p> Phonebook has info for ${len} people</p>` + `${formatTime}`
    response.send(message)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)