import React from 'react'
import Header from '../../components/description-header';
import Section1 from './section1'
import Footer from '../../components/footer'

function HomePage() {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-24">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-12 bg-blue-500 mr-6"></div>
              <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Advertising Platform</span>
              <div className="h-px w-12 bg-blue-500 ml-6"></div>
            </div>
            
            <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Collaborative Advertising Reimagined
              </span>
            </h1>
          </div>
          
          <Section1 />
        </main>
        <Footer />
      </div>
    );
  }

export default HomePage