import InputTodo from './components/InputTodo.jsx'
import ListTodos from './components/ListTodo.jsx'

export default function App() {
  return (
    <div className="container app-container mt-5">
      <InputTodo />
      <ListTodos />
    </div>
  )
}
