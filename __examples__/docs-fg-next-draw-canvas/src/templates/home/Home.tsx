import React from 'react';
import {FgnDrawCanvasComponent, FgnToolbarComponent, FgnZoomComponent} from "fg-next-draw-canvas";
import FGTitle from "../../components/fg-title/FGTitle";

function Home() {
    return (
        <div className="App">
            <FGTitle/>
            <FgnToolbarComponent/>
            <FgnDrawCanvasComponent/>
            <FgnZoomComponent/>
        </div>
    );
}

export default Home;
