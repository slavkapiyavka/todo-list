import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import PlaceholderText from "./PlaceholderTextComponent"

interface Todo { title: string, checked: boolean }

function App() {
  const todoInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(!inputValue)
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

    if (todoInputRef.current) {
      todoInputRef.current.focus()
    }
  }, [loading, todos])

  const onInputValueChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setDisabledSubmitButton(!evt.target.value)
    
    setInputValue(evt.target.value)
  }
  
  const onFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    const input = form[0] as HTMLInputElement
    const inputValue = input.value.trim()
    
    if(inputValue.length >= 1) {
      setTodos([...todos, { title: inputValue, checked: false}])
      setInputValue('')
      setDisabledSubmitButton(true)
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
    <section className="app">
      <h1 className="app__title">todo app</h1>
      {
        loading ?
        <PlaceholderText label="loading" />
        :
        (
          <>
              <form onSubmit={onFormSubmit} className="todo-form">
                <input
                  className="todo-form__input"
                  type="text"
                  value={inputValue}
                  onChange={onInputValueChange}
                  ref={todoInputRef}
                />
                <button type="submit" disabled={disabledSubmitButton}>Add</button>
              </form>

              {todos.length <= 0 ?
              <PlaceholderText label="no todos" />
              :
              <ul className="todo-list">
                {todos.map((todo, index) => (
                  <li key={index} className="todo-element">
                    <label className="todo-element__label">
                      <input
                        className="todo-element__checkbox"
                        type="checkbox"
                        id={`${index}_${todo.title}`}
                        checked={todo.checked}
                        onChange={() => onTodoCheck(index)}
                      />
                      <span className="todo-element__title">{todo.title}</span>
                    </label>
                    <button onClick={() => onTodoRemove(index)} className="todo-element__remove-button">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </li>))}
              </ul>
              }
            </>
        )
      }
    </section>
  )
}

export default App
