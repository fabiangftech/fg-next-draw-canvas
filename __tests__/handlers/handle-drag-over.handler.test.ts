import { handleDragOver } from '../../src/components/fg-next-draw-canvas/handler/handle-drag-over.handler';

describe('handleDragOver', () => {
  it('should prevent default behavior', () => {
    // Arrange
    const mockEvent = {
      preventDefault: jest.fn()
    } as unknown as React.DragEvent;

    // Act
    handleDragOver(mockEvent);

    // Assert
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not throw error with valid event', () => {
    // Arrange
    const mockEvent = {
      preventDefault: jest.fn()
    } as unknown as React.DragEvent;

    // Act & Assert
    expect(() => handleDragOver(mockEvent)).not.toThrow();
  });
});
