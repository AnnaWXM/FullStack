import { useState, useEffect } from 'react'
import Person from './Components/Person'
import personService from './services/persons'

const Filter = ({ filter, handleFilter }) => {
  return (
    <form>
      <div>filter shown with: <input value={filter} onChange={handleFilter} /></div>
    </form>
  );
};

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(person => (
        <li className='note' key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState('message recevied.')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const existPerson = persons.find((person) => person.name === newName)
    if (existPerson) {
      const confirmation = window.confirm('This name already exists in the phonebook, replace the old number with a new one?');
      if (confirmation) {
        const updatePerson = { ...existPerson, number: newNumber }
        personService
          .update(existPerson.id, updatePerson)
          .then(returnedPerson => {
            const updatePersons = persons.map(person => (person.id === returnedPerson.id ? returnedPerson : person))
            setPersons(updatePersons)
            setNewNumber('')
          })
        setMessage(`${existPerson.name} number changed`)
      }
    }
    else {
      const idint = persons.length + 1
      const newPerson = { name: newName, number: newNumber, id: idint.toString() };
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      setMessage(`${newName} person added`)
    }
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
    setShowAll(false); // Set to false whenever the filter changes
  };

  const deletePerson = id => {
    const confirmation = window.confirm('Delete this person?');
    if (confirmation) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
      setMessage(`the person information deleted`)
    }
  }

  const personsToShow = showAll
    ? persons
    : persons.filter(persons => persons.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
