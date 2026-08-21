interface MoveToBilledProps {
  onClose: () => void;
}

const MoveToBilled = ({ onClose }: MoveToBilledProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Move to billed</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default MoveToBilled;