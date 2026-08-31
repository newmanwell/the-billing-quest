import { useEffect, useState } from 'react';

interface BilledCustomer {
  id: number;
  customer_name: string;
  location: string;
  description: string;
  date_onsite: string;
  date_leave_site: string;
  date_billed: string;
}

const BilledCustomers = () => {
  const [customers, setCustomers] = useState<BilledCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBilledCustomers = async () => {
      try {
        const res = await fetch('/billed-customers');
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.log(err);
        setError('Failed to load billed customers');
      }
    };

    fetchBilledCustomers();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2>Billed Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date Onsite</th>
            <th>Date Leave Site</th>
            <th>Date Billed</th>
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
              <td>{customer.date_billed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default BilledCustomers;
