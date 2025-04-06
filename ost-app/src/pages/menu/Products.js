import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

function Products() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [subCategories, setSubCategories] = useState([]); // Store subcategories
  const [formData, setFormData] = useState({
    customer_name: '',
    count: '',
    length: '',
    width: '',
    height: '',    
    status: 'pending',
    total_price: 0,
    description: '',
    category_id: '',
    sub_category_id: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Fetch existing products
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/auth/category/all');
      setCategories(response.data); // Store categories
    } catch (error) {
      console.error(t('error_fetching_categories'), error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]); // Clear subcategories if no category is selected
      return;
    }

    try {
      const response = await api.get(`/auth/subcategories/by-category-id/${categoryId}`);
      setSubCategories(response.data); // Store subcategories
    } catch (error) {
      console.error(t('error_fetching_subcategories'), error);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setFormData({
      ...formData,
      category_id: categoryId, 
      sub_category_id: '', // Reset subcategory
      length: '',          // Clear length
      width: '',           // Clear width
      height: ''           // Clear height
    });
    
    fetchSubCategories(categoryId); // Fetch subcategories based on selected category
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/auth/product/all', {
        params: { skip: 0, limit: 100 },
      });
      setProducts(response.data);
    } catch (error) {
      console.error(t('error_fetching_products'), error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
        console.log("Form Data:", formData);  // Debugging log
        console.log("Subcategories:", subCategories);  // Debugging log

        // Ensure sub_category_id is a number (if IDs are stored as strings)
        const subCategoryId = parseInt(formData.sub_category_id, 10);

        // Find the selected subcategory
        const selectedSubCategory = subCategories.find(sub => parseInt(sub.id, 10) === subCategoryId);

        if (!selectedSubCategory) {
            setError(t('error_invalid_subcategory'));
            console.error("Selected subcategory not found!");
            return;
        }

        console.log("Selected Subcategory:", selectedSubCategory);  // Debugging log

        const availableCount = selectedSubCategory.count - selectedSubCategory.booked;

        // Fetch the existing product count if editing
        let existingProduct = null;
        let previousCount = 0;
        if (isEditing && currentProductId) {
            existingProduct = products.find(prod => prod.id === currentProductId);
            if (existingProduct) {
                previousCount = parseInt(existingProduct.count, 10);
            }
        }

        const newCount = parseInt(formData.count, 10);

        if (!isEditing) {
            // Adding a new product
            if (newCount > availableCount) {
                setError(t('error_count_exceeds_available'));
                return;
            }
        } else {
            // Editing an existing product
            if (newCount > previousCount) {
                setError(t('error_edit_count_increase_forbidden'));
                return;
            }
        }

        let updatedData = {
            id: formData.id,
            customer_name: formData.customer_name,
            count: formData.count,
            length: formData.length,
            width: formData.width,
            height: formData.height || null,
            status: formData.status,
            total_price: formData.total_price,
            description: formData.description,
            category_id: formData.category_id,
            sub_category_id: formData.sub_category_id,
            created_at: formData.created_at,
            last_update: formData.last_update
        };

        if (isEditing && currentProductId) {
            // Call the update API
            await api.put(`/auth/product/edit/${currentProductId}`, updatedData);
            setSuccess(t('product_updated'));
        } else {
            // Call the add API
            await api.post('/auth/product/add', updatedData);
            setSuccess(t('product_added'));
        }

        await fetchSubCategories();

        setFormData({
            customer_name: '',
            count: '',
            length: '',
            width: '',
            height: '',
            status: 'pending',
            total_price: '',
            description: '',
            category_id: '',
            sub_category_id: '',
        });

        setIsEditing(false);
        setCurrentProductId(null);
        fetchProducts(); // Refresh the product list
    } catch (error) {
        setError(t('error_saving_product'));
        console.error(error);
    }
};


  

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "sub_category_id") {
    // Find the selected subcategory by its ID
    const selectedSubCategory = subCategories.find(
      (sub) => sub.id.toString() === value
    );

    // Set the form data with values of the selected subcategory
    setFormData((prev) => ({
      ...prev,
      sub_category_id: value,
      length: selectedSubCategory ? selectedSubCategory.length : "", // Set length from selected subcategory
      width: selectedSubCategory ? selectedSubCategory.width : "",   // Set width from selected subcategory
      height: selectedSubCategory ? selectedSubCategory.height : "", // Set height from selected subcategory
      price_per_piece: selectedSubCategory ? selectedSubCategory.price_per_piece : "",
      total_price: "", // Reset total_price as the subcategory is changing
    }));
  } else {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Calculate total_price when count or price_per_piece changes
      if (name === "count") {
        const countValue = Math.max(0, Number(updatedData.count)); // Ensure non-negative value

        updatedData.price_per_piece = subCategories.find(
          (sub) => sub.id.toString() === prev.sub_category_id.toString()
        ).price_per_piece;

        const pricePerPiece = Number(updatedData.price_per_piece) || 0; // Default to 0 if price_per_piece is missing

        // Calculate the total_price if both count and unit_price are available
        updatedData.total_price = countValue * pricePerPiece;
      }

      return updatedData;
    });
  }
};


  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id); // Ensure this is set correctly
  
    setFormData({
      id:product.id,
      customer_name: product.customer_name,
      count: product.count,
      length: product.length,
      width: product.width,
      height: product.height,
      status: product.status,
      total_price: product.total_price,
      description: product.description,
      category_id: product.category_id,
      sub_category_id: product.sub_category_id,
      created_at:product.created_at,
      last_update:product.last_update
    });
  
    fetchSubCategories(product.category_id); // Load relevant subcategories
  };

  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t('confirm_delete_product'))) return;

    setError('');
    setSuccess('');

    try {
      await api.delete(`/auth/product/by-id/${productId}`);
      setSuccess(t('product_deleted'));
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_deleting_product'));
      console.error(error);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.customer_name?.toLowerCase().includes(query) ||
      String(product.length || "").toLowerCase().includes(query) ||
      String(product.width || "").toLowerCase().includes(query) ||
      String(product.height || "").toLowerCase().includes(query) ||
      product.status?.toLowerCase().includes(query) ||
      String(product.total_price || "").toLowerCase().includes(query) ||
      String(product.description || "").toLowerCase().includes(query) ||
      String(product.category_id || "").toLowerCase().includes(query) ||
      String(product.sub_category_id || "").toLowerCase().includes(query)
    );
  });

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Calculate the showing range (e.g., "Showing 1 to 5 of 50 entries")
  const showingText = t('showing_entries', {
    start: (currentPage - 1) * productsPerPage + 1,
    end: Math.min(currentPage * productsPerPage, filteredProducts.length),
    total: filteredProducts.length,
  });

  return (
    <div className="row mx-md-n5">
      <h1 className="mb-4">{t('orders')}</h1>

      <div className="p-5 border bg-light">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

          <div className="col-md-3">
            <label className="form-label">{t('category')}</label>
            <select
              className="form-select"
              name="category_id"
              value={formData.category_id}
              onChange={handleCategoryChange} // Handle category change
              required
            >
              <option value="">{t('select_category')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

            <div className="col-md-3">
              <label className="form-label">{t('sub_category')}</label>
              <select
                className="form-select"
                name="sub_category_id"
                value={formData.sub_category_id}
                onChange={handleChange}
                required
              >
                <option value="">{t('select_sub_category')}</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {`${subCategory.name} (${subCategory.count} / ${subCategory.booked})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">{t('customer_name')}</label>
              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label">{t('count')}</label>
              <input
                type="text"
                className="form-control"
                name="count"
                value={formData.count}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">{t('length')}</label>
              <input
                type="text"
                className="form-control"
                value={formData.length || ""}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">{t('width')}</label>
              <input
                type="number"
                className="form-control"
                value={formData.width || ""}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">{t('height')}</label>
              <input
                type="number"
                className="form-control"
                value={formData.height || ""}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">{t('total_price')}</label>
              <input
                type="number"
                className="form-control"
                name="total_price"
                value={formData.total_price}
                onChange={handleChange}
                required
              />
            </div>   

            <div className="col-md-9">
              <label className="form-label">{t('description')}</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>       

            {isEditing && (
              <div className="col-md-3">
                <label className="form-label">{t('status')}</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">{t('pending')}</option>
                  <option value="completed">{t('completed')}</option>
                  <option value="canceled">{t('canceled')}</option>
                </select>
              </div>
            )}       

            <div className="col-md-12 mt-3">
              <button type="submit" className="btn btn-success">
                {isEditing ? t('update_product') : t('add_product')}
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

        {filteredProducts.length > 0 ? (
          <>            
            <div className='row'>
              <div className="col-md-1">
                <div className="d-flex justify-content-between mb-3 p-2 flex-grow-1 bd-highlight">                
                  <select
                    title={t('entries_per_page')}
                    className="form-select w-auto"
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange}
                    style={{ width: '80px' }}  // adjust the width to make it smaller
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
              </div>

              <div className='offset-md-10 col-md-1'>
                <button className="btn btn-primary mb-4" onClick={fetchProducts}>
                {t('refresh')}
                </button>
              </div>  
            </div>
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th onClick={() => sortData('product_id')}>
                    {t('product_id')} {sortConfig.key === 'product_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('customer_name')}>
                    {t('customer_name')} {sortConfig.key === 'customer_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('count')}>
                    {t('count')} {sortConfig.key === 'count' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('length')}>
                  {t('length')} {sortConfig.key === 'length' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('width')}>
                  {t('width')} {sortConfig.key === 'width' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('height')}>
                  {t('height')} {sortConfig.key === 'height' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>                  
                  <th onClick={() => sortData('created_at')}>
                  {t('created_at')} {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('last_update')}>
                  {t('last_update')} {sortConfig.key === 'last_update' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('status')}>
                  {t('status')} {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>    
                  <th onClick={() => sortData('total_price')}>
                  {t('total_price')} {sortConfig.key === 'total_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('description')}>
                  {t('description')} {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>              
                  <th onClick={() => sortData('category')}>
                  {t('category')} {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('sub_category')}>
                  {t('sub_category')} {sortConfig.key === 'sub_category_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.id}</td>
                    <td>{product.customer_name}</td>
                    <td>{product.count}</td>
                    <td>{product.length}</td>
                    <td>{product.width}</td>
                    <td>{product.height}</td>
                    <td>{new Date(product.created_at).toLocaleString()}</td>
                    <td>{product.last_update ? new Date(product.last_update).toLocaleString() : "-"}</td>
                    <td>{t(product.status)}</td>     
                    <td>{product.total_price}</td>
                    <td>{product.description}</td>               
                    <td>{product.category_obj ? product.category_obj.name : '-'}</td>
                    <td>{product.sub_category_obj ? product.sub_category_obj.name : '-'}</td>
                    
                    <td>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(product)}>
                          {t('edit')}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>
                          <i className="fas fa-trash-alt me-1"></i> {t('delete')}
                        </button>
                      </div>
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
                    { length: Math.ceil(filteredProducts.length / productsPerPage) },
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
                      currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'disabled' : ''
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

export default Products;
