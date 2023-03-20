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
  const [todoFilter, setTodoFilter] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [searchedTodos, setSearchedTodos] = useState<Todo[]>([]);
  const [status, setStatus] =useState<string>()


  enum TodoStatus {
    Incomplete = "incomplete",
    Started = "started",
    Complete = "complete",
  }

  type Todo = {
    id: string;
    inputValue: string;
    completed: boolean;
    createDate: Date;
    deadLine: Date;
    status: TodoStatus;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value)
    setInputValue(e.target.value)
    // console.log(inputValue);
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = new Date()
    const date = new Date()
    const threeDaysLater = new Date(date.setDate(date.getDate() + 3));
    const newTodo: Todo = {
      id: uuidv4(),
      inputValue: inputValue,
      completed: false,
      createDate: now,
      deadLine: threeDaysLater,
      status: TodoStatus.Incomplete
    }

    console.log(newTodo)
    if (inputValue) {
      setTodos([newTodo, ...todos]);
      setInputValue("");     
    }  
  }

  
  const handleStarted = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: false,
          status: TodoStatus.Started
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    console.log(updatedTodos);
  }

  const handleComplete = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: true,
          status: TodoStatus.Complete
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    console.log(updatedTodos);
  }

  const handleNonComplete = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: false,
          status: TodoStatus.Incomplete
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
    // console.log('-------検索結果--------')
    // console.log(searchedTodos)
    // console.log('-------元々のTODO--------')
    // console.log(todos)

  }
  const handleFilterAllStatus = () => {
    setStatus('')
    handleFilterTodos()
  }
  const handleFilterInCompleteStatus = () => {
    setStatus('incomplete')
    handleFilterTodos()
  }
  const handleFilterCompleteStatus = () => {
    setStatus('complete')
    handleFilterTodos()
  }
  const handleFilterStartedStatus = () => {
    setStatus('started')
    handleFilterTodos()
  }

  const handleFilterTodos = () => {
    if (status === 'incomplete') {
      const filteredTodos = todos.filter(todo => todo.status === TodoStatus.Incomplete)
      setSearchedTodos(filteredTodos)
    } else if (status === 'complete') {
      const filteredTodos = todos.filter(todo => todo.status === TodoStatus.Complete)
      setSearchedTodos(filteredTodos)
    } else if (status === 'started') {
      const filteredTodos = todos.filter(todo => todo.status === TodoStatus.Started)
      setSearchedTodos(filteredTodos)
    } else {
      const filteredTodos = todos
      setSearchedTodos(filteredTodos)
    }
  }

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
          <input type="text" placeholder='TODOを入力' onChange={(e)=> handleChange(e)} />
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
                <button onClick={() => handleStarted(todo.id)}>開始</button>
                <button onClick={() => handleComplete(todo.id)}>完了</button>
                <button onClick={() => handleEditing(todo.id,todo.inputValue)}>編集</button>
              </li>
            )
          })}
          
        </ul>

        {/* <h3>未完了のタスク</h3>
        <ul>
          {todos.filter(todo => !todo.completed).map((todo) => {
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
          
        </ul> */}
      </div>
      <div>
        {/* <h3>完了済みのタスク</h3>
        <ul>
          {todos.filter(todo => todo.completed).map((todo) => {
            return(
              <li key={todo.id}>
              <p>{todo.inputValue}</p>
              <p>作成日：{todo.createDate.toLocaleString()}</p>
              <p>締切：{todo.deadLine.toLocaleString()}</p>
              <button onClick={() => handleNonComplete(todo.id)}>戻す</button>
              
            </li>
            )
          })}
        </ul> */}
      </div>
    </div>
  );
}

export default App;
