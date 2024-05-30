import { ChangeEvent, FocusEvent, FormEvent, useEffect, useRef, useState } from "react"
import PlaceholderText from "./PlaceholderTextComponent"

interface Todo { id: number, title: string, checked: boolean }

function App() {
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const todoInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(!inputValue)
  const [loading, setLoading] = useState<boolean>(true)
  const [editTodoIndex, setEditTodoIndex] = useState<number | null>(null)
  const [editTodoValue, setEditTodoValue] = useState('')

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
      setTodos([{ id: Date.now(), title: inputValue, checked: false}, ...todos])
      setInputValue('')
      setDisabledSubmitButton(true)
    }
  }
  
  const onTodoCheck = (id: number) => {
    const updatedTodos = todos
    const found = updatedTodos.find(todo => todo.id === id)
    if (found) {
      found.checked = !found.checked
    }
    setTodos([...updatedTodos])
  }

  const onTodoEditStart = (id: number) => {
    setEditTodoIndex(id)
    setEditTodoValue(todos[id].title)
  }

  const onTodoEditEnd = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value) {
      const updatedTodos = todos
      if (editTodoIndex) {
        updatedTodos[editTodoIndex].title = e.target.value
      }
      setTodos([...updatedTodos])
      setEditTodoIndex(null)
      setEditTodoValue('')
    }
  }

  const onTodoRemove = (id: number) => {
    setTodos(todos?.filter((todo) => id !== todo.id))
  }
  
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos)) 
    }
    setLoading(false)

    if (todoInputRef.current) {   
      todoInputRef.current.focus()
    }
  }, [loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [loading, todos])

  useEffect(() => {
    setEditTodoIndex(null)
    setEditTodoValue('')
  }, [todos])

  useEffect(() => {
    if (editTodoInputRef.current) {
      editTodoInputRef.current.focus()
    }
  }, [editTodoIndex])

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
                {todos.map((todo) => (
                  <li key={todo.id} className={`todo-element${editTodoIndex === todo.id ? ' todo-element_edit-mode' : ''}`}>
                    <label className="todo-element__label">
                      <input
                        className="todo-element__checkbox"
                        type="checkbox"
                        id={`${todo.id}`}
                        checked={todo.checked}
                        onChange={() => onTodoCheck(todo.id)}
                      />
                      <div className="todo-element__pseudo-checkbox"></div>
                      {
                        editTodoIndex === todo.id ?
                        <input
                          className="todo-element__title todo-element__title_edit-mode"
                          value={editTodoValue}
                          onChange={(e) => setEditTodoValue(e.target.value)}
                          onBlur={(e) => onTodoEditEnd(e)}
                          ref={editTodoInputRef}
                        />
                        :
                        <span className="todo-element__title">{todo.title}</span>
                      }
                    </label>
                    
                    <button onClick={() => onTodoEditStart(todo.id)} className="todo-element__edit-button" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>

                    <button onClick={() => onTodoRemove(todo.id)} className="todo-element__remove-button" type="button" disabled={editTodoIndex === todo.id}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
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
