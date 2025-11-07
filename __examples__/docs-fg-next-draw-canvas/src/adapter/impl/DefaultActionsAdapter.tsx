import {Adapter} from "../Adapter";
import {FgnNodeAction} from "fg-next-draw-canvas";
import {FgnNodeModel} from "../../../../../src";

export class DefaultActionsAdapter implements Adapter<void, FgnNodeAction[]> {
    to(data: void): FgnNodeAction[] {
        return [
            {
                id: 'Quick Start',
                label: 'GO',
                onClick: (nodeId: string) => {
                    alert(`the node id is ${nodeId}`)
                },
                isDisabled: (node: FgnNodeModel): boolean => {
                    return node.code !== 'installation';
                }
            }
        ];
    }
}