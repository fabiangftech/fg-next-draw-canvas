import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./templates/home/Home";
import {Adapter} from "./adapter/Adapter";
import {FgnNodeAction} from "fg-next-draw-canvas";
import {DefaultActionsAdapter} from "./adapter/impl/DefaultActionsAdapter";
import {useInitDataLocalHandler} from "./templates/home/handler/useInitDataLocalHandler";
const defaultActionsAdapter: Adapter<void, FgnNodeAction[]> = new DefaultActionsAdapter();

function App() {
    return (
        <BrowserRouter basename="/fg-next-draw-canvas">
            <Routes>
                <Route path="/" element={<Home
                    actionsAdapter={defaultActionsAdapter}
                    initDataLocalHandler={useInitDataLocalHandler}
                />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
