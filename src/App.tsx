/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null); // 編集中のTODOのIDを格納する
  const [editValue, setEditValue] = useState("");
  

  type Todo = {
    id: string;
    inputValue: string;
    completed: boolean;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value)
    setInputValue(e.target.value)
    // console.log(inputValue);
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo: Todo = {
      id: uuidv4(),
      inputValue: inputValue,
      completed: false
    }
    if (inputValue) {
      setTodos([newTodo, ...todos]);
      setInputValue("");     
    }  
  }

  const handleComplete = (id: string,inputValue: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: true,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    console.log(updatedTodos);
  }
  const handleNonComplete = (id: string,inputValue: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: false,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    console.log(updatedTodos);
  }
  
 

  const handleEditing = (id: string,inputValue: string) => {
    setEditing(true)
    setEditId(id);
    setEditValue(inputValue)
    console.log(editing)
    console.log(editId)

  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
    const updatedTodos = todos.map(todo => {
      if (todo.id === editId) {
        return {
          ...todo,
          inputValue: editValue,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditing(false)


  }

  const handleEditCancel = () => {
    setEditing(false)
    setEditId(null)
    setEditValue('')
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  return (
    <div className="App">
      <h2>TODOリスト</h2>
      {!editing ? (
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="text" placeholder='TODOを入力' onChange={(e)=> handleChange(e)} />
          <input type="submit" value='作成' />
        </form>
        
      </div>
      ):(
        <form onSubmit={(e) => handleEditSubmit(e)}>
          <input type="text" value={editValue} onChange={(e)=> handleEditChange(e)} />
          <input type="submit" value='編集' />
          <button onClick={() => handleEditCancel()}>キャンセル</button>
        </form>
      )}
      
      <div>
        <h3>未完了のタスク</h3>
        <ul>
          {todos.filter(todo => !todo.completed).map((todo) => {
            return(
              <li key={todo.id}>
              {todo.inputValue}
              <button onClick={() => handleComplete(todo.id, todo.inputValue)}>完了</button>
              <button onClick={() => handleEditing(todo.id,todo.inputValue)}>編集</button>
            </li>
            )
          })}
          
        </ul>
      </div>
      <div>
        <h3>完了済みのタスク</h3>
        <ul>
          {todos.filter(todo => todo.completed).map((todo) => {
            return(
              <li key={todo.id}>
              {todo.inputValue}
              <button onClick={() => handleNonComplete(todo.id, todo.inputValue)}>戻す</button>
              
            </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
