import { ChangeEvent, FormEvent, useEffect, useState } from "react"

interface Todo { label: string, checked: boolean }

function App() {
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos)) 
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [loading, todos])

  const onInputValueChange = (evt: ChangeEvent<HTMLInputElement>) => setInputValue(evt.target.value)
  
  const onFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    const input = form[0] as HTMLInputElement
    const inputValue = input.value.trim()
    
    if(inputValue.length >= 1) {
      setTodos([...todos, {label: inputValue, checked: false}])
      setInputValue('')
    }
  }
  
  const onTodoCheck = (id: number) => {
    const updatedTodos = todos
    updatedTodos[id].checked = !updatedTodos[id].checked
    setTodos([...updatedTodos])
  }

  const onTodoRemove = (id: number) => {
    setTodos(todos?.filter((_, index) => id !== index))
  }

  return (
    <>
      {loading ? <p>loading</p> : (
        <>
        <h1>todo app</h1>
        <form onSubmit={onFormSubmit}>
          <input type="text" value={inputValue} onChange={onInputValueChange} />
          <button type="submit">add</button>
        </form>

        {todos && todos.length >= 1 ? (
          <ul>
            {todos.map((todo, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    id={`${index}_${todo.label}`}
                    checked={todo.checked}
                    onChange={() => onTodoCheck(index)}
                  />
                  <span>{todo.label}</span>
                </label>
                <button onClick={() => onTodoRemove(index)}>x</button>
              </li>))}
          </ul>
        ) : <p>no todos</p>}
      </>
      )}
    </>
  )
}

export default App
