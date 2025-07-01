import { useState, useEffect } from 'react';
import { fetchFoodCategories } from '../api/index.js';
import './FoodCategories.css';

const FoodCategories = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchFoodCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('카테고리 로딩 오류:', error);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect && typeof onCategorySelect === 'function') {
      onCategorySelect(categoryId === selectedCategory ? null : categoryId);
    }
  };

  if (loading) {
    return <div className="categories-loading">카테고리 로딩 중...</div>;
  }

  return (
    <div className="food-categories-container">
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategories;
