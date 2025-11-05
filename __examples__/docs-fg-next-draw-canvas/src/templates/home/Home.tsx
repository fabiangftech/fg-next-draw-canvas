import React from 'react';
import {
    FgnDrawCanvasComponent, FgnNodeAction,
    FgnToolbarComponent,
    FgnZoomComponent,
} from "fg-next-draw-canvas";
import FGTitle from "../../components/fg-title/FGTitle";
import {Adapter} from "../../adapter/Adapter";

export interface HomeProps {
    actionsAdapter: Adapter<void, FgnNodeAction[]>;
    initDataLocalHandler: () => void;
}

function Home({actionsAdapter,initDataLocalHandler}: HomeProps) {
    initDataLocalHandler();
    const nodeActions = actionsAdapter.to();

    return (
        <div className="App">
            <FGTitle/>
            <FgnToolbarComponent/>
            <FgnDrawCanvasComponent nodeActions={nodeActions}/>
            <FgnZoomComponent/>
        </div>
    );
}

export default Home;
