import {Command} from "../Command";
import {calculateConnectionPoints, CANVAS_EVENTS, FgnEventBus, FgnNodeModel} from "fg-next-draw-canvas";

export class InitDataLocalCommand implements Command<void, null> {

    private readonly eventBus: FgnEventBus

    constructor(eventBus: FgnEventBus) {
        this.eventBus = eventBus;
    }

    execute(data: void): null {
        const connectionPoints = calculateConnectionPoints(400, 200, 150, 75);
        const connectionPointsTwo = calculateConnectionPoints(400 * 1.5, 200, 150, 75);
        const connectionPointsThree = calculateConnectionPoints(400 * 2, 200, 150, 75);
        const nodes: FgnNodeModel[] = [
            {
                id: "1",
                x: 400,
                y: 200,
                label: "Installation",
                code: "installation",
                status: "",
                color: "",
                width: 150,
                height: 75,
                leftConnectionPoint: connectionPoints.left,
                rightConnectionPoint: connectionPoints.right
            } as FgnNodeModel,
            {
                id: "2",
                x: 400 * 1.5,
                y: 200,
                label: "Configuration",
                code: "configuration",
                status: "",
                color: "",
                width: 150,
                height: 75,
                leftConnectionPoint: connectionPointsTwo.left,
                rightConnectionPoint: connectionPointsTwo.right
            } as FgnNodeModel,

            {
                id: "3",
                x: 400 * 2,
                y: 200,
                label: "First Canvas",
                code: "first-canvas",
                status: "",
                color: "",
                width: 150,
                height: 75,
                leftConnectionPoint: connectionPointsThree.left,
                rightConnectionPoint: connectionPointsThree.right
            } as FgnNodeModel
        ];
        this.eventBus.emit(CANVAS_EVENTS.NODES_REPLACED, nodes);
        return null;
    }
}