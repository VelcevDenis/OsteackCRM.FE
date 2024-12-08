import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function PotentialClients() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    firm_name: '',
    email: '',
    phone: '',
    next_meeting: '',
    status: 'pending',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);

  // Fetch existing clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/auth/potentialCompanies/all', {
        params: { skip: 0, limit: 100 },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching potential clients:', error);
    }
  };

  // Handle form submission (for adding or editing)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      let updatedData = {
        next_meeting: formData.next_meeting || null,
        status: formData.status,
        description: formData.description || '',
      };

      // Map 'approved' to 'completed'
      if (formData.status === 'approved') {
        updatedData.status = 'completed';
      }

      // Conditionally set is_approved based on the status
      if (updatedData.status !== 'pending') {
        updatedData.is_approved = updatedData.status === 'completed' ? 1 : 0;
      }

      if (isEditing && currentCompanyId) {
        // Update existing company
        await api.put(`/auth/recallCompanis/edit/${currentCompanyId}`, updatedData);
        setSuccess('Company updated successfully!');
      } else {
        // Add new company
        await api.post('/auth/recallCompanis/add', {
          firm_name: formData.firm_name,
          email: formData.email,
          phone: formData.phone,
          next_meeting: formData.next_meeting || null,
          is_approved: updatedData.status === 'completed', // For 'approved', treat as completed
          status: updatedData.status,
          description: formData.description || '',
        });
        setSuccess('Company added successfully!');
      }

      // Reset form after submission
      setFormData({
        firm_name: '',
        email: '',
        phone: '',
        next_meeting: '',
        status: 'pending',
        description: '',
      });
      setIsEditing(false);
      setCurrentCompanyId(null);
      fetchClients(); // Refresh the list
    } catch (error) {
      setError('Error saving company.');
      console.error(error);
    }
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle editing of client data
  const handleEdit = (client) => {
    setIsEditing(true);
    setCurrentCompanyId(client.company_id);
    setFormData({
      firm_name: client.firm_name,
      email: client.email,
      phone: client.phone,
      next_meeting: client.next_meeting ? new Date(client.next_meeting).toISOString().slice(0, 16) : '',
      status: client.status,
      description: client.description || '',
    });
  };

  return (
    <div className="row mx-md-n5">
      <h1 className="mb-4">Potential Companies</h1>

      {/* Form for adding or editing a potential company */}
      <div className="p-5 border bg-light">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Firm Name</label>
              <input
                type="text"
                className="form-control"
                name="firm_name"
                value={formData.firm_name}
                onChange={handleChange}
                required
                readOnly={isEditing}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={isEditing}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                readOnly={isEditing}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Next Meeting</label>
              <input
                type="datetime-local"
                className="form-control"
                name="next_meeting"
                value={formData.next_meeting}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="waiting">Waiting</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mt-3">
              <button type="submit" className="btn btn-success">
                {isEditing ? 'Update Company' : 'Add Company'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success/Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Data Display Table */}
      <div className="p-5 border bg-light">
        {clients.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Company ID</th>
                <th>Firm Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Next Meeting</th>
                <th>Approved</th>
                <th>Status</th>
                <th>Description</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index}>
                  <td>{client.company_id}</td>
                  <td>{client.firm_name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{new Date(client.next_meeting).toLocaleString()}</td>
                  <td>{client.is_approved ? 'Yes' : 'No'}</td>
                  <td>{client.status}</td>
                  <td>{client.description || 'N/A'}</td>
                  <td>{new Date(client.last_update).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(client)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-warning">No potential companies found.</p>
        )}
      </div>
    </div>
  );
}

export default PotentialClients;
