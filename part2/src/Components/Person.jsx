const Person = ({ person }) => {
    return (
        <li>{person.content}</li>
    )
}

export default Person
/**
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? 'make not important' : 'make important'

    return (
        <li>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
}

export default Note
*/