
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

const CategoryPage = () => {
  const { slug } = useParams();

  const titleMap = {
    men: "Men's Collection",
    women: "Women's Collection",
    'new-in': 'New In',
    essentials: 'Essentials',
    winter: 'Winter Collection',
    footwear: 'Footwear',
    accessories: 'Accessories',
    all: 'All Products'
  };

  const title = titleMap[slug] || 'Products';

  return <ProductList title={title} categorySlug={slug} />;
};

export default CategoryPage;
