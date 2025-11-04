import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./templates/home/Home";

function App() {
    return (
        <BrowserRouter basename="/fg-next-draw-canvas">
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
