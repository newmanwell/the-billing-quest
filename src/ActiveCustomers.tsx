import { useEffect, useState } from 'react';
import AddActiveCustomer from './AddActiveCustomer';
import MoveToBilled from './MoveToBilled';

interface ActiveCustomer {
  id: number;
  customer_name: string;
  location: string;
  description: string;
  date_onsite: string;
  date_leave_site: string;
}

const ActiveCustomers = () => {
  const [customers, setCustomers] = useState<ActiveCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showMoveToBilled, setShowMoveToBilled] = useState(false);

  const fetchActiveCustomers = async () => {
    try {
      const res = await fetch('/active-customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.log(err);
      setError('Failed to load active customers');
    }
  };

  useEffect(() => {
    fetchActiveCustomers();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Active Customers</h1>
      <button onClick={() => setShowAddCustomer(true)}>Add New Customer</button>
      {showAddCustomer && (
        <AddActiveCustomer
          onClose={() => setShowAddCustomer(false)}
          onCustomerAdded={fetchActiveCustomers}
        />
      )}
      {showMoveToBilled && (
        <MoveToBilled onClose={() => setShowMoveToBilled(false)} />
      )}
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date Onsite</th>
            <th>Date Leave Site</th>
            <th>Send to Billed</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.customer_name}</td>
              <td>{customer.location}</td>
              <td>{customer.description}</td>
              <td>{customer.date_onsite}</td>
              <td>{customer.date_leave_site}</td>
              <td><button onClick={() => setShowMoveToBilled(true)}>Billed</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ActiveCustomers;
