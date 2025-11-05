import React, {Component} from 'react';
import {
    FgnDrawCanvasComponent, FgnNodeAction,
    FgnToolbarComponent,
    FgnZoomComponent,
} from "fg-next-draw-canvas";
import FGTitle from "../../components/fg-title/FGTitle";
import {Adapter} from "../../adapter/Adapter";
import {Command} from "../../cqrs/Command";

export interface HomeProps {
    actionsAdapter: Adapter<void, FgnNodeAction[]>;
    initDataLocalCommand: Command<void, null>;
}

export class Home extends Component<HomeProps> {

    private readonly initDataLocalCommand: Command<void, null>;
    private readonly nodeActions: FgnNodeAction[];

    constructor(props: HomeProps) {
        super(props);
        this.initDataLocalCommand = props.initDataLocalCommand;
        this.nodeActions = props.actionsAdapter.to();
    }

    componentDidMount() {
        this.initDataLocalCommand.execute();
    }

    render() {
        return (
            <div className="App">
                <FGTitle/>
                <FgnToolbarComponent/>
                <FgnDrawCanvasComponent nodeActions={this.nodeActions}/>
                <FgnZoomComponent/>
            </div>
        );
    }
}

export default Home;
