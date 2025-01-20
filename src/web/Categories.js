// Categories.js
import React from "react";
import Header from '../components/header'
import CategoriesContent from './contents/categoriesContent';
// import LoadingSpinner from './components/LoadingSpinner';

function Categories() {
//   const [loading, setLoading] = useState(true);

//   // Update loading state based on children
//   const handleLoading = (status) => {
//     setLoading(status);
//   };

  return (
    <div className='ad-waitlist'>
      <Header />
      {/* {loading && <LoadingSpinner />} */}
      <CategoriesContent />
    </div>
  )
}

export default Categories