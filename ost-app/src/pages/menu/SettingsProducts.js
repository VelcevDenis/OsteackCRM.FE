import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryManager() {
  const { t } = useTranslation();

  // State Management
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', count: '', categoryId: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/auth/category/all', { params: { skip: 0, limit: 100 } });
      setCategories(response.data);
    } catch (error) {
      console.error(t('error_fetching_categories'), error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/auth/subcategory/all', { params: { skip: 0, limit: 100 } });
      setSubcategories(response.data);
    } catch (error) {
      console.error(t('error_fetching_subcategories'), error);
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategory.trim()) {
      setError(t('category_name_required'));
      return;
    }

    try {
      await api.post('/auth/category/add', { name: newCategory.trim() });
      setSuccess(t('category_created'));
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_creating_category'));
      console.error(error);
    }
  };

  const handleCreateSubcategory = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
  
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) {
      setError(t('subcategory_name_required'));
      return;
    }
  
    try {
      const response = await api.post('/auth/subcategory/add', {
        name: newSubcategory.name.trim(),
        count: newSubcategory.count.trim(),
        category_id: newSubcategory.categoryId
      });
  
      setSuccess(t('subcategory_created'));
  
      // Manually add the new subcategory to the existing state
      setSubcategories((prevSubcategories) => [
        { id: response.data.id, name: newSubcategory.name, count:newSubcategory.count, category_id: newSubcategory.categoryId },
        ...prevSubcategories
      ]);
      
  
      // Keep the selected category but clear the subcategory name
      setNewSubcategory({ name: '', count:'', categoryId: newSubcategory.categoryId });
      
    } catch (error) {
      setError(error.response?.data?.detail || t('error_creating_subcategory'));
      console.error(error);
    }
  };
  

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(t('confirm_delete_category'))) return;

    setError('');
    setSuccess('');

    try {
      await api.delete(`/auth/category/by-id/${categoryId}`);
      setSuccess(t('category_deleted'));
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_deleting_category'));
      console.error(error);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm(t('confirm_delete_subcategory'))) return;

    setError('');
    setSuccess('');

    try {
      await api.delete(`/auth/subcategory/by-id/${subcategoryId}`);
      setSuccess(t('subcategory_deleted'));
      fetchSubcategories();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_deleting_subcategory'));
      console.error(error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setUpdatedCategoryName(category.name);
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setUpdatedSubcategoryName(subcategory.name);
  };

  const handleUpdateCategory = async () => {
    if (!updatedCategoryName.trim()) {
      setError(t('category_name_required'));
      return;
    }

    try {
      await api.put(`/auth/category/${editingCategory.id}`, { name: updatedCategoryName.trim() });
      setSuccess(t('category_updated'));
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_updating_category'));
      console.error(error);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!updatedSubcategoryName.trim()) {
      setError(t('subcategory_name_required'));
      return;
    }
  
    // Ensure count is an integer before sending it
    const count = parseInt(editingSubcategory.count.trim(), 10);
    
    if (isNaN(count)) {
      setError(t('subcategory_count_required')); // Ensure it's a valid number
      return;
    }
  
    try {
      await api.put(`/auth/subcategory/${editingSubcategory.id}`, {
        name: updatedSubcategoryName.trim(),
        count: count,
        booked: -1,
         // Ensure count is passed as an integer
      });
      setSuccess(t('subcategory_updated'));
      setEditingSubcategory(null);
      fetchSubcategories();
    } catch (error) {
      setError(error.response?.data?.detail || t('error_updating_subcategory'));
      console.error(error);
    }
  };
  
  
  

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setNewSubcategory({ ...newSubcategory, categoryId });
  
    if (!categoryId) {
      setSubcategories([]); // Reset subcategories if no category is selected
      return;
    }
  
    try {
      const response = await api.get(`/auth/subcategories/by-category-id/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setSubcategories([]); // Set an empty list if no subcategories found
      } else {
        console.error(t('error_fetching_subcategories'), error);
      }
    }
  };  

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Category Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="fw-bold">{t('manage_categories')}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateCategory} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control col-md-1"
                    placeholder={t('new_category')}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success">{t('add_category')}</button>
                </div>
              </form>
              <div className="list-container">
                <ul className="list-group">
                  {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between">
                      {category.name}
                      <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-primary btn-sm" onClick={() => handleEditCategory(category)}>
                          {t('edit')}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>
                          <i className="fas fa-trash-alt me-1"></i> {t('delete')}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t('edit_category')}</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingCategory(null)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={updatedCategoryName}
                    onChange={(e) => setUpdatedCategoryName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>
                    {t('cancel')}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdateCategory}>
                    {t('update')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


{/* sub category model */}

        {/* Subcategory Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-secondary text-white text-center">
              <h3 className="fw-bold">{t('manage_subcategories')}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateSubcategory} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('new_subcategory')}
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('new_subcategory_count')}
                    value={newSubcategory.count}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, count: e.target.value })}
                    required
                  />
                  <select className="form-select" value={newSubcategory.categoryId} onChange={handleCategoryChange}>
                    <option value="">{t('select_category')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-dark">{t('add_subcategory')}</button>
                </div>
              </form>
              <div className="list-container">
                <ul className="list-group">
                  {subcategories.map((subcategory) => (
                    <li key={subcategory.id} className="list-group-item d-flex justify-content-between">
                      <div className="d-flex justify-content-between w-100">
                        <div className="flex-grow-1">{subcategory.name}</div>
                        <div className="text-center" style={{ width: '80px' }}>
                          {subcategory.count}
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <button className="btn btn-primary btn-sm" onClick={() => handleEditSubcategory(subcategory)}>
                            {t('edit')}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                            <i className="fas fa-trash-alt me-1"></i> {t('delete')}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

              {/* Edit Sub Category Modal */}
      {editingSubcategory && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('edit_sub_category')}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingSubcategory(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="subcategoryName" className="form-label">
                    {t('subcategory_name')}
                  </label>
                  <input
                    type="text"
                    id="subcategoryName"
                    className="form-control"
                    value={updatedSubcategoryName}
                    onChange={(e) => setUpdatedSubcategoryName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subcategoryCount" className="form-label">
                    {t('subcategory_count')}
                  </label>
                  <input
                    type="number"
                    id="subcategoryCount"
                    className="form-control"
                    value={editingSubcategory.count} // Bind the count to the input value
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, count: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSubcategory(null)}>
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateSubcategory}
                >
                  {t('update')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CategoryManager;
