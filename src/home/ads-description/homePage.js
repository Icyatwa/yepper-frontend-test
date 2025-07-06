// HomePage.js
import React from 'react';
import Header from '../../components/description-header';
import Section1 from './section1';
import Section2 from './section2';
import Footer from '../../components/footer'

function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Section1 />
        <Section2 />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;