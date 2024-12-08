import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function PotencialClients() {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(5);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

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

      if (formData.status === 'approved') {
        updatedData.status = 'completed';
      }

      if (updatedData.status !== 'pending') {
        updatedData.is_approved = updatedData.status === 'completed' ? 1 : 0;
      }

      if (isEditing && currentCompanyId) {
        await api.put(`/auth/recallCompanis/edit/${currentCompanyId}`, updatedData);
        setSuccess('Company updated successfully!');
      } else {
        await api.post('/auth/recallCompanis/add', {
          ...formData,
          next_meeting: formData.next_meeting || null,
          is_approved: updatedData.status === 'completed',
        });
        setSuccess('Company added successfully!');
      }

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
      fetchClients();
    } catch (error) {
      setError('Error saving company.');
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

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

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.firm_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      (client.description && client.description.toLowerCase().includes(query))
    );
  });

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedClients = [...filteredClients].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setClients(sortedClients);
  };

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleClientsPerPageChange = (event) => {
    setClientsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Calculate the showing range (e.g., "Showing 1 to 5 of 50 entries")
  const showingText = `Showing ${indexOfFirstClient + 1} to ${Math.min(indexOfLastClient, filteredClients.length)} of ${filteredClients.length} entries`;

  return (
    <div className="row mx-md-n5">
      <h1 className="mb-4">Potential Companies</h1>

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

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="p-5 border bg-light">
        <div className="d-flex bd-highlight">
          <div className="mb-3 p-2 flex-grow-1 bd-highlight">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by firm name, email, phone, or description"
            />
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <>
            <div className="d-flex bd-highlight">
              <div className="d-flex justify-content-between mb-3 p-2 flex-grow-1 bd-highlight">
                <label className="form-label">Entries per page:</label>
                <select
                  className="form-select w-auto"
                  value={clientsPerPage}
                  onChange={handleClientsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th onClick={() => sortData('company_id')}>
                    Company ID {sortConfig.key === 'company_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('firm_name')}>
                    Firm Name {sortConfig.key === 'firm_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('email')}>
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('phone')}>
                    Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('next_meeting')}>
                    Next Meeting {sortConfig.key === 'next_meeting' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('is_approved')}>
                    Approved {sortConfig.key === 'is_approved' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('status')}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('description')}>
                    Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('last_update')}>
                    Last Update {sortConfig.key === 'last_update' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client, index) => (
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
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(client)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex bd-highlight">
              {/* Showing range text */}
              <div className="mb-3 p-2 flex-grow-1 bd-highlight">{showingText}</div>

              <nav aria-label="Page navigation example" className="p-2 bd-highlight">
                <ul className="pagination justify-content-end">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                      Previous
                    </button>
                  </li>
                  {Array.from(
                    { length: Math.ceil(filteredClients.length / clientsPerPage) },
                    (_, idx) => (
                      <li
                        key={idx}
                        className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => paginate(idx + 1)}>
                          {idx + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(filteredClients.length / clientsPerPage) ? 'disabled' : ''
                    }`}
                  >
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <p className="text-warning">No potential companies found.</p>
        )}
      </div>
    </div>
  );
}

export default PotencialClients;
