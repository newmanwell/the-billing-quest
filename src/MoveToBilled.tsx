import { useState, type FormEvent } from 'react';

interface ActiveCustomer {
  id: number;
  customer_name: string;
  location: string;
  description: string;
  date_onsite: string;
  date_leave_site: string;
}

interface MoveToBilledProps {
  customer: ActiveCustomer;
  onClose: () => void;
  onMoved: () => void;
}

const MoveToBilled = ({ customer, onClose, onMoved }: MoveToBilledProps) => {
  const [dateBilled, setDateBilled] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/active-customers/${customer.id}/move-to-billed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateBilled }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      onMoved();
      onClose();
    } catch (err) {
      console.log(err);
      setError('Failed to move customer to billed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Move to billed</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Date Billed
            <input value={dateBilled} onChange={(e) => setDateBilled(e.target.value)} required />
          </label>
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MoveToBilled;