import {Adapter} from "../Adapter";
import {FgnNodeAction} from "fg-next-draw-canvas";

export class DefaultActionsAdapter implements Adapter<void, FgnNodeAction[]> {
    to(data: void): FgnNodeAction[] {
        return [
            {
                id: '1',
                label: 'W',
                onClick: (nodeId: string) => {
                    console.log(`the node id is ${nodeId}`)
                }
            }
        ];
    }
}