import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';
import { generateNodeId } from '../utils/generate-node-id.util';

/**
 * Handles the drop event when a node is dropped onto the canvas
 */
export const createHandleDrop = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  NODE_ADDED_EVENT: string
) => {
  return (e: React.DragEvent) => {
    e.preventDefault();
    const nodeLabel = e.dataTransfer.getData('nodeLabel');
    const itemDataStr = e.dataTransfer.getData('itemData');

    if (nodeLabel && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let itemData = null;
      try {
        if (itemDataStr) {
          itemData = JSON.parse(itemDataStr);
        }
      } catch (error) {
        console.error('Error parsing itemData:', error);
      }

      const newNode: FgnNodeModel = {
        id: generateNodeId(),
        x: x - 50,
        y: y - 25,
        width: 100,
        height: 50,
        label: nodeLabel,
        ...itemData,
      };

      setNodes([...nodes, newNode]);
      
      // Emit event with the newly added node
      emit<FgnNodeModel>(NODE_ADDED_EVENT, newNode);
    }
  };
};

