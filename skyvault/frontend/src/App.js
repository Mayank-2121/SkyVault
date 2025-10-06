import React from "react";
import Home from "./components/Home.js";
import RegisterUser from "./components/RegisterUser.js";
import LoginUser from "./components/LoginUser.js";
import HomepageUser from "./components/HomepageUser.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from './components/About';
import Contact from './components/Contact';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/login-user" element={<LoginUser />} />
                <Route path="/homepage-user" element={<HomepageUser />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
