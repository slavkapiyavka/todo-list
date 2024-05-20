import { SyntheticEvent } from "react";

interface InputChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

interface ButtonElement {
  type: 'button' | 'submit' 
}

export type { InputChangeEvent, ButtonElement }
