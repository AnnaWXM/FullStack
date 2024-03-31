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
        <li className='person' key={person._id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible) {
    return null;
  }

  let className = 'notification'
  if (type === 'error') {
    className = 'error'
  }

  return (
    <div className={className}>
      {message}
    </div>
  );
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState('message recevied.')
  const [isError, setIsError] = useState(false)

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
          .catch(error => {
            setMessage(`Information of ${newName} has been removed from server`)
            setIsError(true)
          })
        setMessage(`${existPerson.name} number changed`)
      }
    }
    else {
      let idint;
      if (persons.length == 0) {
        idint = 1
      }
      else {
        idint = persons.length + 1
      }
      let existId = persons.find((person) => person._id == idint)
      while (existId) {
        idint = idint + 1
        existId = persons.find((person) => person._id == idint)
      }
      const newPerson = { name: newName, number: newNumber, _id: idint.toString() };
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


  const [className, setClassName] = useState('notification')
  if (isError) {
    setClassName('error')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={className} />
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
