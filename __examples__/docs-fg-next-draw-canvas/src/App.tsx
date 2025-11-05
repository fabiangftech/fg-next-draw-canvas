import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./templates/home/Home";
import {Adapter} from "./adapter/Adapter";
import {FgnEventBus, fgnGlobalEventBus, FgnNodeAction} from "fg-next-draw-canvas";
import {DefaultActionsAdapter} from "./adapter/impl/DefaultActionsAdapter";
import {Command} from "./cqrs/Command";
import {InitDataLocalCommand} from "./cqrs/impl/InitDataLocalCommand";

const eventBus: FgnEventBus = fgnGlobalEventBus;
const defaultActionsAdapter: Adapter<void, FgnNodeAction[]> = new DefaultActionsAdapter();
const initDataLocalCommand: Command<void, null> = new InitDataLocalCommand(eventBus);

function App() {
    return (
        <BrowserRouter basename="/fg-next-draw-canvas">
            <Routes>
                <Route path="/" element={<Home actionsAdapter={defaultActionsAdapter}
                                               initDataLocalCommand={initDataLocalCommand}/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
