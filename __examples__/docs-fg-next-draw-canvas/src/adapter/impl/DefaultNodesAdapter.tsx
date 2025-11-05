import {Adapter} from "../Adapter";
import {FgnNodeModel} from "fg-next-draw-canvas";

export class DefaultNodesAdapter implements Adapter<void, FgnNodeModel[]>{
    to(data: void): FgnNodeModel[] {
        return [];
    }
}