import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

function Employees() {
  const { t } = useTranslation();

  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_id: '3',
    country: '',
    city: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setuserId] = useState(null);

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
      const response = await api.get('/auth/user/all', {
        params: { skip: 0, limit: 100 },
      });
      setClients(response.data);
    } catch (error) {
      console.error(t('error_fetching_users'), error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    setError('');
    setSuccess('');

    try {
      let updatedData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role_id: formData.role_id,
        country: formData.country,
        city: formData.city,
        date_of_birth: formData.date_of_birth,
        description: formData.description || '',
      };

      if (isEditing && userId) {
        await api.put(`/auth/user/edit/${userId}`, updatedData);
        setSuccess('User updated successfully!');
      } else {
        await api.post('/auth/employee/add', {
          ...formData,
          date_of_birth: formData.date_of_birth || null         
        });
        setSuccess(t('user_added'));
      }

      setFormData({
        first_name: '',
        last_name: '',        
        email: '',
        phone: '',
        created_at: '',
        description: '',
        last_date_connection: '',
        role_id: '3',
        country: '',
        city: '',
        date_of_birth: '',
      });
      setIsEditing(false);
      setuserId(null);
      fetchClients();
    } catch (error) {
      setError(t(error));
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (client) => {
    setIsEditing(true);
    setuserId(client.userId);  // Correct ID mapping
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone || '',
      country: client.country,
      role_id: client.role_id || '3',
      city: client.city,
      date_of_birth:client.date_of_birth,
      description: client.description || '',
    });
  };

  // Filter clients based on search query  

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(query) ||
      client.last_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      client.created_at?.toLowerCase().includes(query) ||
      client.description?.toLowerCase().includes(query) ||
      client.last_date_connection?.toLowerCase().includes(query) ||
      client.role?.toLowerCase().includes(query) ||
      client.country?.toLowerCase().includes(query) ||
      client.city?.toLowerCase().includes(query) ||
      client.date_of_birth?.toLowerCase().includes(query)
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
  const showingText = t('showing_entries', {
    start: (currentPage - 1) * clientsPerPage + 1,
    end: Math.min(currentPage * clientsPerPage, filteredClients.length),
    total: filteredClients.length,
  });

  return (
    <div className="row mx-md-n5">
      <h1 className="mb-4">{t('employees')}</h1>

      <div className="p-5 border bg-light">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">{t('first_name')}</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>     
            <div className="col-md-2">
              <label className="form-label">{t('last_name')}</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t('email')}</label>
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

            <div className="col-md-2">
              <label className="form-label">{t('phone')}</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t('role')}</label>
              <select
                className="form-select"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}                
              >                
                <option value="3">{t('worker')}</option>
                <option value="2">{t('admin')}</option>                
              </select>
            </div>     
            
                   

            <div className="col-md-2">
              <label className="form-label">{t('country')}</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t('city')}</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-2">
              <label className="form-label">{t('date_of_birth')}</label>
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t('password')}</label>
              <input
                type="password"
                className="form-control"
                name="hashed_pass"
                value={formData.hashed_pass}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">{t('description')}</label>
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
                {isEditing ? t('update_employee') : t('add_employee')}
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
            <label className="form-label">{t('search')}</label>
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('search_placeholder')}
            />
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <>
            <div className="d-flex bd-highlight">
              <div className="d-flex justify-content-between mb-3 p-2 flex-grow-1 bd-highlight">
                <label className="form-label">{t('entries_per_page')}:</label>
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
                  <th onClick={() => sortData('userId')}>
                    {t('userId')} {sortConfig.key === 'userId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('first_name')}>
                    {t('first_name')} {sortConfig.key === 'first_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('last_name')}>
                    {t('last_name')} {sortConfig.key === 'last_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('email')}>
                  {t('email')} {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('phone')}>
                  {t('phone')} {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('created_at')}>
                  {t('created_at')} {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('last_date_connection')}>
                  {t('last_date_connection')} {sortConfig.key === 'last_date_connection' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('date_of_birth')}>
                  {t('date_of_birth')} {sortConfig.key === 'date_of_birth' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('role')}>
                  {t('role')} {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('country')}>
                  {t('country')} {sortConfig.key === 'country' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>                  
                  <th onClick={() => sortData('city')}>
                  {t('city')} {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('description')}>
                  {t('description')} {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.userId}</td>
                    <td>{client.first_name}</td>
                    <td>{client.last_name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{new Date(client.created_at).toLocaleString()}</td>
                    <td>{new Date(client.last_date_connection).toLocaleString()}</td>
                    <td>{new Date(client.date_of_birth).toLocaleString()}</td>
                    <td>{client.role}</td>
                    <td>{client.country}</td>
                    <td>{client.city}</td>    
                    <td>{client.description || t('n_a')}</td>                                                        
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(client)}>
                        {t('edit')}
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
                    {t('previous')}
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
                      {t('next')}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <p className="text-warning">{t('no_potential_companies_found')}</p>
        )}
      </div>
    </div>
  );
}

export default Employees;
