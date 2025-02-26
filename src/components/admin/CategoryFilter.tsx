// components/CategoryFilter.tsx
import Link from 'next/link';

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  currentCategory = 'all' 
}) => {
  return (
    <div>
      <Link href="/">
        Toutes les vidéos
      </Link>
     
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${encodeURIComponent(category)}`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;