// Home.js
import React from "react";
import Header from "../components/header";
import './home.css';
import Title from "../components/title";
import Section1 from '../aboutComponents/section1'
import Footer from "../components/footer"

export default function Home() {
  return (
    <div className="homeContainer">
      <div className="backgroundImage"></div>
      <Header />
      <Title />
      <Section1 />
      <Footer />
    </div>
  );
}
