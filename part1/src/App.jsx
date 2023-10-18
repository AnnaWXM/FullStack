import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

function findIndexOfMaxValue(arr) {
  let maxIndex = 0; // Initialize maxIndex with 0 as the default
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i; // Update maxIndex if a larger value is found
    }
  }
  return maxIndex;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));

  console.log(selected)

  const handleVoteClick = () => {
    const newPoints = [...points]; // Create a copy of the points array
    newPoints[selected] += 1;
    setPoints(newPoints); // Update the state to trigger a re-render
  };


  console.log(points)
  let maxPoints = findIndexOfMaxValue(points);

  return (
    <div>

      <h1>Anecdotes of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p> Has {points[selected]} votes.</p>
      <Button handleClick={() => handleVoteClick()} text='VOTE' />
      <Button handleClick={() => setSelected(Math.floor(Math.random() * 8))} text='next anecdotes' />

      <h1>Anecdotes with most votes</h1>
      <p>{anecdotes[maxPoints]}</p>
      <p> Has {points[maxPoints]} votes.</p>

    </div>
  )
}

export default App