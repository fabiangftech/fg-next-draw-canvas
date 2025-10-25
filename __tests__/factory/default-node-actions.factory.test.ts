import { defaultNodeActions } from '../../src/factory/default-node-actions.factory';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('defaultNodeActions', () => {
  it('should have three default actions', () => {
    // Assert
    expect(defaultNodeActions).toHaveLength(3);
  });

  it('should have Edit action with correct properties', () => {
    // Arrange
    const editAction = defaultNodeActions[0];

    // Assert
    expect(editAction.id).toBe('Edit');
    expect(editAction.label).toBe('E');
    expect(editAction.order).toBe(1);
    expect(typeof editAction.onClick).toBe('function');
    expect(typeof editAction.isDisabled).toBe('function');
  });

  it('should have Delete action with correct properties', () => {
    // Arrange
    const deleteAction = defaultNodeActions[1];

    // Assert
    expect(deleteAction.id).toBe('Delete');
    expect(deleteAction.label).toBe('D');
    expect(deleteAction.order).toBe(2);
    expect(typeof deleteAction.onClick).toBe('function');
  });

  it('should have Settings action with correct properties', () => {
    // Arrange
    const settingsAction = defaultNodeActions[2];

    // Assert
    expect(settingsAction.id).toBe('Settings');
    expect(settingsAction.label).toBe('S');
    expect(settingsAction.order).toBe(3);
    expect(typeof settingsAction.onClick).toBe('function');
  });

  it('should execute Edit action onClick', () => {
    // Arrange
    const editAction = defaultNodeActions[0];
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    // Act
    editAction.onClick('test-node-id');

    // Assert
    expect(alertSpy).toHaveBeenCalledWith("'Edit node:', test-node-id");
    
    alertSpy.mockRestore();
  });

  it('should disable Edit action for node-a code', () => {
    // Arrange
    const editAction = defaultNodeActions[0];
    const node: FgnNodeModel = {
      id: '1',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      code: 'node-a',
      label: 'Test'
    };

    // Act
    const isDisabled = editAction.isDisabled(node);

    // Assert
    expect(isDisabled).toBe(true);
  });
});
