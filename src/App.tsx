import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ActiveCustomers from './ActiveCustomers'

function App() {

  return (
    <>
      <header>
        <h1>The Billing Quest</h1>
        <Link to='/activecustomers'>Active Customers</Link>
      </header>
      <Routes>
        <Route path="/activecustomers" element={<ActiveCustomers />} />
      </Routes>
    </>
  )
}

export default App
