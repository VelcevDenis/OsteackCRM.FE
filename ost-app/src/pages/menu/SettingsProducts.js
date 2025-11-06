import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryManager() {
  const { t } = useTranslation();

  // ------- настройки "окна" на 6 строк -------
  const ROWS = 6;
  const LIST_ROW_H = 48;   // высота одного пункта слева (px)
  const TBL_ROW_H  = 46;   // высота строки таблицы (px)
  const TBL_HEAD_H = 54;   // высота заголовка таблицы (px)

  const listWindowStyle = {
    maxHeight: LIST_ROW_H * ROWS,
    overflowY: 'auto',
    borderRadius: 8
  };

  const tableWindowStyle = {
    maxHeight: TBL_HEAD_H + TBL_ROW_H * ROWS,
    overflow: 'auto',
    borderRadius: 8
  };

  const thStickyStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: 'inherit'
  };

  const tdCompactStyle = {
    height: TBL_ROW_H,
    verticalAlign: 'middle',
    paddingTop: '.5rem',
    paddingBottom: '.5rem'
  };
  // -------------------------------------------

  // State Management
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', count: '', length: '', width: '', height: '', price_per_piece: '', categoryId: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    fetchCategories();
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
        length: newSubcategory.length.trim(),
        width: newSubcategory.width.trim(),
        height: newSubcategory.height.trim(),
        price_per_piece: newSubcategory.price_per_piece.trim(),
        category_id: newSubcategory.categoryId
      });
  
      setSuccess(t('subcategory_created'));
  
      // Добавляем в состояние, чтобы не дёргать список заново
      setSubcategories((prev) => [
        {
          id: response.data.id,
          name: newSubcategory.name,
          count: newSubcategory.count,
          length: newSubcategory.length,
          width: newSubcategory.width,
          height: newSubcategory.height,
          price_per_piece: newSubcategory.price_per_piece,
          category_id: newSubcategory.categoryId,
          balance: newSubcategory.balance,
          m3: newSubcategory.m3
        },
        ...prev
      ]);
      
      // Очищаем поля, оставляя выбранную категорию
      setNewSubcategory({
        name: '',
        count: '',
        length: '',
        width: '',
        height: '',
        price_per_piece: '',
        categoryId: newSubcategory.categoryId
      });
      
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
  
    const count = parseInt(editingSubcategory.count?.toString().trim() || '0', 10);
    const length = parseInt(editingSubcategory.length?.toString().trim() || '0', 10);
    const width = parseInt(editingSubcategory.width?.toString().trim() || '0', 10);
    const height = parseInt(editingSubcategory.height?.toString().trim() || '0', 10);
    const price_per_piece = parseFloat(editingSubcategory.price_per_piece?.toString().trim() || '0');
  
    if (isNaN(count) || isNaN(length) || isNaN(width) || isNaN(height) || isNaN(price_per_piece)) {
      setError(t('invalid_numeric_value'));
      return;
    }
  
    try {
      await api.put(`/auth/subcategory/${editingSubcategory.id}`, {
        name: updatedSubcategoryName.trim(),
        count,
        length,
        width,
        height,
        price_per_piece,
        booked: -1
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
      setSubcategories([]);
      return;
    }
  
    try {
      const response = await api.get(`/auth/subcategories/by-category-id/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setSubcategories([]);
      } else {
        console.error(t('error_fetching_subcategories'), error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Category Section (LEFT) */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4" style={{display:'flex',flexDirection:'column',minHeight:0}}>
            <div className="card-header bg-primary text-white text-center">
              <h3 className="fw-bold">{t('manage_categories')}</h3>
            </div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12,minHeight:0}}>
              <form onSubmit={handleCreateCategory} className="mb-2">
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

              {/* ОКНО на 6 пунктов */}
              <div className="list-container" style={listWindowStyle}>
                <ul className="list-group">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{height: LIST_ROW_H, paddingTop: '.5rem', paddingBottom: '.5rem'}}
                    >
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

        {/* Subcategory Section (RIGHT) */}
        <div className={`col-md-8 manageSubcategoriesModel position-relative ${isFullScreen ? 'fullscreen-mode' : ''}`}>
          <div className="card shadow-lg border-0" style={{display:'flex',flexDirection:'column',minHeight:0}}>
            <div className="card-header bg-secondary text-white text-center d-flex justify-content-between align-items-center position-relative">
              <h3 className="fw-bold mb-0">{t('manage_subcategories')}</h3>
              <button
                type="button"
                className="btn btn-light btn-sm position-absolute top-0 end-0 me-2 mt-2 p-1"
                style={{ width: 28, height: 28, borderRadius: '50%', zIndex: 10 }}
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? t('exit_fullscreen') : t('fullscreen')}
              >
                {isFullScreen ? '✕' : '⛶'}
              </button>
            </div>

            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12,minHeight:0}}>
              <form onSubmit={handleCreateSubcategory} className="mb-2">
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
                    placeholder={t('length')}
                    value={newSubcategory.length}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, length: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('width')}
                    value={newSubcategory.width}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, width: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('height')}
                    value={newSubcategory.height}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, height: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('price_per_piece')}
                    value={newSubcategory.price_per_piece}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, price_per_piece: e.target.value })}
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

              {/* ОКНО на 6 строк + sticky thead */}
              <div style={tableWindowStyle}>
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th style={thStickyStyle}>{t('subcategory')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('length')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('width')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('height')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('price_per_piece')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('count')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('booked')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('balance')}</th>
                      <th style={{...thStickyStyle, width: 80}} className="text-center">{t('m3')}</th>
                      <th style={{...thStickyStyle, width: 160}} className="text-center">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((subcategory) => (
                      <tr key={subcategory.id}>
                        <td style={tdCompactStyle}>{subcategory.name}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.length}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.width}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.height}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.price_per_piece}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.count}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.booked}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.balance}</td>
                        <td style={tdCompactStyle} className="text-center">{subcategory.m3}</td>
                        <td style={tdCompactStyle} className="d-flex gap-2 align-items-center">
                          <button className="btn btn-primary btn-sm" onClick={() => handleEditSubcategory(subcategory)}>
                            {t('edit')}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                            <i className="fas fa-trash-alt me-1"></i> {t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <label htmlFor="length" className="form-label">
                    {t('length')}
                  </label>
                  <input
                    type="number"
                    id="length"
                    className="form-control"
                    value={editingSubcategory.length}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, length: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="width" className="form-label">
                    {t('width')}
                  </label>
                  <input
                    type="number"
                    id="width"
                    className="form-control"
                    value={editingSubcategory.width}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, width: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="height" className="form-label">
                    {t('height')}
                  </label>
                  <input
                    type="number"
                    id="height"
                    className="form-control"
                    value={editingSubcategory.height}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, height: e.target.value })}
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
                    value={editingSubcategory.count}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, count: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="unitPrice" className="form-label">
                    {t('price_per_piece')}
                  </label>
                  <input
                    type="number"
                    id="unitPrice"
                    className="form-control"
                    value={editingSubcategory.price_per_piece}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, price_per_piece: e.target.value })}
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
