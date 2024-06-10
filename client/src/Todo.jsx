import React, { useState, useEffect } from 'react';
import axios from 'axios';

let endpoint = 'http://localhost:9000';

const Todo = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch todos from the server
    axios.get(`${endpoint}/todos`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the todos!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      const newTask = { task, completed: false };
      axios.post(`${endpoint}/todos`, newTask)
        .then(response => {
          setTodos([...todos, response.data]);
          setTask('');
        })
        .catch(error => {
          console.error('There was an error adding the todo!', error);
        });
    }
  };

  const handleChangeTask = (e) => {
    setTask(e.target.value);
  };

  const handleToggle = (id) => {
    const todo = todos.find(todo => todo.id === id);
    axios.patch(`${endpoint}/todos/${id}`, { completed: !todo.completed })
      .then(response => {
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      })
      .catch(error => {
        console.error('There was an error toggling the todo!', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${endpoint}/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the todo!', error);
      });
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        {todos
          .filter(todo => !todo.completed)
          .map(todo => (
            <div key={todo.id} className="flex items-center justify-between p-2 bg-gray-200 mb-2 rounded">
              <span>{todo.task}</span>
              <div>
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Check
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        {todos
          .filter(todo => todo.completed)
          .map(todo => (
            <div key={todo.id} className="flex items-center justify-between p-2 bg-gray-400 mb-2 rounded">
              <span>{todo.task}</span>
              <div>
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Uncheck
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="w-1/3 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="task"
            placeholder="Add task"
            value={task}
            onChange={handleChangeTask}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default Todo;
