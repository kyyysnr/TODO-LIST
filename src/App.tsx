/* eslint-disable array-callback-return */

import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null); // 編集中のTODOのIDを格納する
  const [editValue, setEditValue] = useState("");
  const [todoFilter, setTodoFilter] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [searchedTodos, setSearchedTodos] = useState<Todo[]>([]);
  const [status, setStatus] =useState<string>()

  type Todo = {
    id: string;
    inputValue: string;
    createDate: Date;
    deadLine: Date;
    status: 'incomplete'|'complete'|'started';
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)   
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = new Date()
    const date = new Date()
    const threeDaysLater = new Date(date.setDate(date.getDate() + 3));
    const newTodo: Todo = {
      id: uuidv4(),
      inputValue: inputValue,
      createDate: now,
      deadLine: threeDaysLater,
      status: 'incomplete'
    }
    if (inputValue === '') return
    setTodos([newTodo, ...todos]);     
    setInputValue(""); 
  }

  
  const handleStarted = (id: string) => {
    const updatedTodos: Todo[] = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          status: "started"
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    console.log(updatedTodos);
  }

  const handleComplete = (id: string) => {
    const updatedTodos: Todo[] = todos.map(todo => {
      if (todo.id === id) {
        if (todo.status === 'complete') {
          return{
            ...todo, 
            status: "incomplete"
          } 
          
        } else if (todo.status === 'incomplete') {
          return{
            ...todo, 
            status: "complete"
          }        
        }      
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
    
    const updatedTodos = todos.map(todo => todo.id === editId ? {...todo, inputValue: editValue} : todo);
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

  const handleFilter = () => {
    setTodoFilter(!todoFilter)
    setSearchText('')
  }

  const isLimitDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    return date.getTime() > now.getTime();
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTodos = todos.filter(todo => todo.inputValue.includes(searchText));
    setSearchedTodos(searchTodos);
  }

  const handleFilterAllStatus = () => {
    setStatus('')
  }
  
  const handleFilterInCompleteStatus = () => {
    setStatus('incomplete')
  }
  
  const handleFilterCompleteStatus = () => {
    setStatus('complete')
  }
  
  const handleFilterStartedStatus = () => {
    setStatus('started')
  }
  
  const handleFilterTodos = useCallback(() => {
    if (status !== '') {
      const filteredTodos = todos.filter(todo => todo.status === status)
      setSearchedTodos(filteredTodos)
    } else {
      setSearchedTodos(todos)
    }
  }, [status, todos])
  
  useEffect(() => {
    handleFilterTodos()
  }, [handleFilterTodos])

  return (
    <div className="App">
      <h2>TODOリスト</h2>
      {searchText? (
        <div>
          <p>{searchText}</p>
          <h3>検索したリスト</h3>
          <ul>
            {searchedTodos.map((todo) => {
              return(
                <div>
                  <li key={todo.id}>
                  <p>{todo.inputValue}</p>
                  <p>作成日：{todo.createDate.toLocaleString()}</p>
                  <p>締切：{todo.deadLine.toLocaleString()}</p>
                  </li>
                </div>
              )
            })}
          </ul>
        </div>
       

      ) : <div></div> }
      {todoFilter?(
        <div>
          <form onSubmit={(e) => handleSearch(e)}>
            <input type="text" placeholder='検索したい文字列'onChange={(e) => setSearchText(e.target.value)} />
            <input type="submit" value='検索' />
          </form>
          <button onClick={()=>handleFilter()}>入力画面に戻る</button>
        </div>
        
      ):(!editing ? (
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="text" placeholder='TODOを入力' value={inputValue} onChange={(e)=> handleChange(e)} />
          <input type="submit" value='作成' />
          <button onClick={()=> handleFilter()}>検索</button>
        </form>
        
      </div>
      ):(
        <form onSubmit={(e) => handleEditSubmit(e)}>
          <input type="text" value={editValue} onChange={(e)=> handleEditChange(e)} />
          <input type="submit" value='編集' />
          <button onClick={() => handleEditCancel()}>キャンセル</button>
          <button onClick={()=> handleFilter()}>検索</button>
        </form>
      ))}
      
      <div>
        <button onClick={()=>handleFilterAllStatus()}>全てのTODO</button>
        <button onClick={()=>handleFilterInCompleteStatus()}>未完了のTODO</button>
        <button onClick={()=> handleFilterStartedStatus()}>開始済みのTODO</button>
        <button onClick={()=>handleFilterCompleteStatus()}>完了済みのTODO</button>

        <h3>フィルタリングしたTODO</h3>
        <ul>
          {searchedTodos.map((todo) => {
            return(
              <li key={todo.id}>
                
                <p>{todo.inputValue}</p>
                <p>作成日：{todo.createDate.toLocaleString()}</p>
                <p>締切：{todo.deadLine.toLocaleString()}</p>
              
              </li>
            )
          })}
          
        </ul>

        <h3>未完了のタスク</h3>
        <ul>
          {todos.filter(todo => todo.status === "incomplete").map((todo) => {
            return(
              <li key={todo.id}>
                
                <p>{todo.inputValue}</p>
                <p>作成日：{todo.createDate.toLocaleString()}</p>
                <p>締切：{todo.deadLine.toLocaleString()}</p>
                <button onClick={() => handleStarted(todo.id)}>開始</button>
                <button onClick={() => handleComplete(todo.id)}>完了</button>
                <button onClick={() => handleEditing(todo.id,todo.inputValue)}>編集</button>
              </li>
            )
          })}
          
        </ul> 
      </div>
      <div>
      <h3>開始済みのタスク</h3>
        <ul>
          {todos.filter(todo => todo.status === "started").map((todo) => {
            return(
              <li key={todo.id}>
                
                <p>{todo.inputValue}</p>
                <p>作成日：{todo.createDate.toLocaleString()}</p>
                <p>締切：{todo.deadLine.toLocaleString()}</p>
                <button onClick={() => handleStarted(todo.id)}>開始</button>
                <button onClick={() => handleComplete(todo.id)}>完了</button>
                <button onClick={() => handleEditing(todo.id,todo.inputValue)}>編集</button>
              </li>
            )
          })}
          
        </ul> 
      </div>
      <div>
        <h3>完了済みのタスク</h3>
        <ul>
          {todos.filter(todo => todo.status === "complete").map((todo) => {
            return(
              <li key={todo.id}>
              <p>{todo.inputValue}</p>
              <p>作成日：{todo.createDate.toLocaleString()}</p>
              <p>締切：{todo.deadLine.toLocaleString()}</p>
              <button onClick={() => handleComplete(todo.id)}>戻す</button>
              
            </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
