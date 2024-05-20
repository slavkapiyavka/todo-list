import { useState } from "react"
import { InputChangeEvent } from "../shared/interfaces"

export default function Input() {
  const [inputvalue, setInputvalue] = useState('')

  const onInputChange = (e: InputChangeEvent<HTMLInputElement>) => setInputvalue(e.target.value)

  return (<input type="text" value={inputvalue} onChange={onInputChange}/>)
}
