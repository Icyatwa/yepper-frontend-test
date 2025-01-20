// Home.js
import React from "react";
import Header from "../components/header";
import './home.css';
import Title from "../components/title";
import Section1 from '../aboutComponents/section1'
// import Request from "../register/request";
// import SearchField from "../components/home_search";
// import Section1 from "../components/section1";
// import Section2 from "../components/section2";
import Footer from "../components/footer"

export default function Home() {
  return (
    <div className="homeContainer">
      <div className="backgroundImage"></div>
      <Header />
      <Title />
      <Section1 />
      {/* <Request /> */}
      {/* <SearchField /> */}
      {/* <Section1 />
      <Section2 /> */}
      <Footer />
    </div>
  );
}
