import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [pharmacyComment, setPharmacyComment] = useState('');
  const [pharmacyStatus, setPharmacyStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch all prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/prescriptions');
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setError('Failed to fetch prescriptions.');
      }
    };
    fetchPrescriptions();
  }, []);

  // Function to handle selecting a prescription for edit
  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setPharmacyComment(prescription.Pharmacy_Comment || '');
    setPharmacyStatus(prescription.Pharmacy_Status || '');
  };

  // Function to update pharmacy details for the selected prescription
  const handleUpdatePharmacyDetails = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Pharmacy_Comment', pharmacyComment);
    formData.append('Pharmacy_Status', pharmacyStatus);

    try {
      // Patch request to update pharmacy details
      await axios.patch(`http://localhost:5000/api/prescriptions/${selectedPrescription._id}/pharmacy`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Pharmacy details updated successfully!');

      // Refresh prescriptions after update
      const response = await axios.get('http://localhost:5000/api/prescriptions');
      setPrescriptions(response.data);

      // Clear selected prescription and form fields
      setSelectedPrescription(null);
      setPharmacyComment('');
      setPharmacyStatus('');
    } catch (error) {
      console.error('Error updating pharmacy details:', error);
      setError('Failed to update pharmacy details.');
    }
  };

  return (
    <div>
      <h2>Prescription Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px', minWidth: '300px' }}>
          <h3>Prescription List</h3>
          <ul>
            {prescriptions.map((prescription) => (
              <li key={prescription._id}>
                <button onClick={() => handleSelectPrescription(prescription)}>
                  Select
                </button>
                {prescription.Patient_Name}
              </li>
            ))}
          </ul>
        </div>
        {selectedPrescription && (
          <div>
            <h3>Edit Pharmacy Details</h3>
            <form onSubmit={handleUpdatePharmacyDetails}>
              <label>
                Pharmacy Comment:
                <textarea
                  value={pharmacyComment}
                  onChange={(e) => setPharmacyComment(e.target.value)}
                  required
                />
              </label>
              <label>
                Pharmacy Status:
                <input
                  type="text"
                  value={pharmacyStatus}
                  onChange={(e) => setPharmacyStatus(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Update Pharmacy Details</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionPage;
