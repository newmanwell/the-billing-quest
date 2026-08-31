import { useEffect, useState } from 'react';
import AddActiveCustomer from './AddActiveCustomer';
import MoveToBilled from './MoveToBilled';
import EditActiveCustomer from './EditActiveCustomer';

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
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ActiveCustomer | null>(null);

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
      <h2>Active Customers</h2>
      <button onClick={() => setShowAddCustomer(true)}>Add New Customer</button>
      {showAddCustomer && (
        <AddActiveCustomer
          onClose={() => setShowAddCustomer(false)}
          onCustomerAdded={fetchActiveCustomers}
        />
      )}
      {showMoveToBilled && selectedCustomer && (
        <MoveToBilled
          customer={selectedCustomer}
          onClose={() => setShowMoveToBilled(false)}
          onMoved={fetchActiveCustomers}
        />
      )}
      {
        showEdit && selectedCustomer && (
          <EditActiveCustomer
            customer={selectedCustomer}
            onClose={() => setShowEdit(false)}
            onUpdated={fetchActiveCustomers}
          />
        )
      }
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date Onsite</th>
            <th>Date Leave Site</th>
            <th>Action</th>
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
              <td><button onClick={() => { setSelectedCustomer(customer); setShowMoveToBilled(true); }}>Billed</button>
                  <button onClick={() => { setSelectedCustomer(customer); setShowEdit(true); }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ActiveCustomers;
