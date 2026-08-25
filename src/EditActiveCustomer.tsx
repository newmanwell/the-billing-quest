import { useState, type FormEvent } from 'react';

interface ActiveCustomer {
  id: number;
  customer_name: string;
  location: string;
  description: string;
  date_onsite: string;
  date_leave_site: string;
}

interface EditActiveCustomerProps {
  customer: ActiveCustomer;
  onClose: () => void;
  onUpdated: () => void;
}

const EditActiveCustomer = ({ customer, onClose, onUpdated }: EditActiveCustomerProps) => {
  const [customerName, setCustomerName] = useState(customer.customer_name);
  const [location, setLocation] = useState(customer.location);
  const [description, setDescription] = useState(customer.description);
  const [dateOnsite, setDateOnsite] = useState(customer.date_onsite);
  const [dateLeaveSite, setDateLeaveSite] = useState(customer.date_leave_site);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/active-customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, location, description, dateOnsite, dateLeaveSite }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      setError('Failed to update customer');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Customer</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Customer Name
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </label>
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Date Onsite
            <input value={dateOnsite} onChange={(e) => setDateOnsite(e.target.value)} />
          </label>
          <label>
            Date Leave Site
            <input value={dateLeaveSite} onChange={(e) => setDateLeaveSite(e.target.value)} />
          </label>
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditActiveCustomer;
