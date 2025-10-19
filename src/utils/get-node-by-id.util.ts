import { fgnGlobalEventBus } from './fg-next-event-system/fgn-event-bus';
import { CANVAS_EVENTS } from '../components/fg-next-draw-canvas/model/canvas-events.constants';
import { FgnNodeModel } from '../components/fg-next-node/model/fgn-node.model';

/**
 * Interface for the request data
 */
interface GetNodeByIdRequest {
  id: string;
  requestId: string;
}

/**
 * Interface for the response data
 */
interface GetNodeByIdResponse {
  node: FgnNodeModel | null;
  requestId: string;
}

/**
 * Gets a node by its ID using the event system
 * @param id - The ID of the node to find
 * @returns Promise that resolves to the node if found, null otherwise
 */
export const getNodeById = (id: string): Promise<FgnNodeModel | null> => {
  return new Promise((resolve, reject) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Set up timeout to avoid hanging promises
    const timeout = setTimeout(() => {
      fgnGlobalEventBus.off(CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE, responseHandler);
      reject(new Error('Timeout: No response received for getNodeById request'));
    }, 5000);

    // Response handler
    const responseHandler = (response: GetNodeByIdResponse) => {
      if (response.requestId === requestId) {
        clearTimeout(timeout);
        fgnGlobalEventBus.off(CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE, responseHandler);
        resolve(response.node);
      }
    };

    // Listen for response
    fgnGlobalEventBus.on<GetNodeByIdResponse>(CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE, responseHandler);

    // Emit request
    const request: GetNodeByIdRequest = { id, requestId };
    fgnGlobalEventBus.emit<GetNodeByIdRequest>(CANVAS_EVENTS.GET_NODE_BY_ID_REQUEST, request);
  });
};
