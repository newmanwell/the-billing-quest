import { useState, type FormEvent } from 'react';
import './App.css';

interface AddActiveCustomerProps {
  onClose: () => void;
  onCustomerAdded: () => void;
}

const AddActiveCustomer = ({ onClose, onCustomerAdded }: AddActiveCustomerProps) => {
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [dateOnsite, setDateOnsite] = useState('');
  const [dateLeaveSite, setDateLeaveSite] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/active-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, location, description, dateOnsite, dateLeaveSite }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      onCustomerAdded();
      onClose();
    } catch (err) {
      console.log(err);
      setError('Failed to add customer');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Customer</h2>
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
            <button type="submit">Add Customer</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActiveCustomer;
