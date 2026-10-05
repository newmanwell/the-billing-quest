import { useEffect, useState, type FormEvent } from 'react';

interface Todo {
  id: number;
  active_customer_id: number;
  text: string;
  completed: boolean;
}

interface ActiveCustomerTodosProps {
  activeCustomerId: number;
}

const ActiveCustomerTodos = ({ activeCustomerId }: ActiveCustomerTodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`/active-customers/${activeCustomerId}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.log(err);
      setError('Failed to load to-do items');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [activeCustomerId]);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/active-customers/${activeCustomerId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      setNewTodoText('');
      fetchTodos();
    } catch (err) {
      console.log(err);
      setError('Failed to add to-do item');
    }
  };

  const handleToggleCompleted = async (todo: Todo) => {
    try {
      const res = await fetch(`/active-customers/${activeCustomerId}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      fetchTodos();
    } catch (err) {
      console.log(err);
      setError('Failed to update to-do item');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const res = await fetch(`/active-customers/${activeCustomerId}/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      fetchTodos();
    } catch (err) {
      console.log(err);
      setError('Failed to delete to-do item');
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo)}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </label>
            <button type="button" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTodo}>
        <input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="New to-do item"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ActiveCustomerTodos;
