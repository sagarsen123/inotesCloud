import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
 
import NoteState from "./Contexts-Notes/NoteState";

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <div className="container">
            
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
