import React from 'react';
import {FgnDrawCanvasComponent, FgnToolbarComponent, FgnZoomComponent} from "fg-next-draw-canvas";

function Home() {
    return (
        <div className="App">
            <FgnToolbarComponent/>
            <FgnDrawCanvasComponent/>
            <FgnZoomComponent/>
        </div>
    );
}

export default Home;
