import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import ActiveCustomers from './ActiveCustomers'
import BilledCustomers from './BilledCustomers'

function App() {

  return (
    <>
      <header>
        <h1>The Billing <span className='the-Q'>Q</span>uest</h1>
        <div>
          <NavLink to='/activecustomers'>Active Customers</NavLink>
          <NavLink to='/billedcustomers'>Billed Customers</NavLink>
        </div>
      </header>
      <Routes>
        <Route path="/activecustomers" element={<ActiveCustomers />} />
        <Route path="/billedcustomers" element={<BilledCustomers />} />
      </Routes>
    </>
  )
}

export default App
