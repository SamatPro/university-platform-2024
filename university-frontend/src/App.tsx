import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  username: string;  // предположим, что у пользователя есть только имя
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Error:', error));
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1>University Platform Users</h1>
          <ul>
            {users.map((user, index) => (
                <li key={index}>{user.username}</li>
            ))}
          </ul>
        </header>
      </div>
  );
}

export default App;