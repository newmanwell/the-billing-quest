import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ActiveCustomers from './ActiveCustomers'
import BilledCustomers from './BilledCustomers'

function App() {

  return (
    <>
      <header>
        <h1>The Billing Quest</h1>
        <Link to='/activecustomers'>Active Customers</Link>
        <Link to='/billedcustomers'>Billed Customers</Link>
      </header>
      <Routes>
        <Route path="/activecustomers" element={<ActiveCustomers />} />
        <Route path="/billedcustomers" element={<BilledCustomers />} />
      </Routes>
    </>
  )
}

export default App
