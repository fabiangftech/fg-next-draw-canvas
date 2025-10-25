import { NodeActionGroupingService, DEFAULT_ACTION_GROUPING_CONFIG } from '../../src/components/fg-next-node/model/fgn-node-actions-group.model';
import { FgnNodeAction } from '../../src/components/fg-next-node/model/fgn-node-action.model';

describe('NodeActionGroupingService', () => {
  const createMockAction = (id: string, order?: number): FgnNodeAction => ({
    id,
    label: id.charAt(0),
    order: order || 0,
    onClick: jest.fn()
  });

  describe('groupActions', () => {
    it('should return all actions as visible when under limit', () => {
      // Arrange
      const actions = [
        createMockAction('Action1', 1),
        createMockAction('Action2', 2)
      ];

      // Act
      const result = NodeActionGroupingService.groupActions(actions);

      // Assert
      expect(result.visibleActions).toHaveLength(2);
      expect(result.dropdownActions).toHaveLength(0);
      expect(result.hasDropdown).toBe(false);
    });

    it('should group actions when over limit', () => {
      // Arrange
      const actions = [
        createMockAction('Action1', 1),
        createMockAction('Action2', 2),
        createMockAction('Action3', 3),
        createMockAction('Action4', 4)
      ];

      // Act
      const result = NodeActionGroupingService.groupActions(actions);

      // Assert
      expect(result.visibleActions).toHaveLength(3);
      expect(result.dropdownActions).toHaveLength(1);
      expect(result.hasDropdown).toBe(true);
      expect(result.visibleActions[0].id).toBe('Action1');
      expect(result.dropdownActions[0].id).toBe('Action4');
    });

    it('should sort actions by order property', () => {
      // Arrange
      const actions = [
        createMockAction('Action3', 3),
        createMockAction('Action1', 1),
        createMockAction('Action2', 2)
      ];

      // Act
      const result = NodeActionGroupingService.groupActions(actions);

      // Assert
      expect(result.visibleActions[0].id).toBe('Action1');
      expect(result.visibleActions[1].id).toBe('Action2');
      expect(result.visibleActions[2].id).toBe('Action3');
    });

    it('should handle actions without order property', () => {
      // Arrange
      const actions = [
        createMockAction('Action1', 1),
        createMockAction('Action2'), // No order
        createMockAction('Action3', 2),
        createMockAction('Action4', 3)
      ];

      // Act
      const result = NodeActionGroupingService.groupActions(actions);

      // Assert
      expect(result.visibleActions).toHaveLength(3);
      expect(result.dropdownActions).toHaveLength(1);
      expect(result.hasDropdown).toBe(true);
      // Should have 3 visible and 1 dropdown
      expect(result.visibleActions.length + result.dropdownActions.length).toBe(4);
    });

    it('should use custom configuration', () => {
      // Arrange
      const actions = [
        createMockAction('Action1', 1),
        createMockAction('Action2', 2)
      ];
      const customConfig = { maxVisibleActions: 1, dropdownLabel: 'More' };

      // Act
      const result = NodeActionGroupingService.groupActions(actions, customConfig);

      // Assert
      expect(result.visibleActions).toHaveLength(1);
      expect(result.dropdownActions).toHaveLength(1);
      expect(result.hasDropdown).toBe(true);
    });

    it('should handle empty actions array', () => {
      // Arrange
      const actions: FgnNodeAction[] = [];

      // Act
      const result = NodeActionGroupingService.groupActions(actions);

      // Assert
      expect(result.visibleActions).toHaveLength(0);
      expect(result.dropdownActions).toHaveLength(0);
      expect(result.hasDropdown).toBe(false);
    });
  });

  describe('DEFAULT_ACTION_GROUPING_CONFIG', () => {
    it('should have correct default values', () => {
      // Assert
      expect(DEFAULT_ACTION_GROUPING_CONFIG.maxVisibleActions).toBe(3);
      expect(DEFAULT_ACTION_GROUPING_CONFIG.dropdownLabel).toBe('⋮');
    });
  });
});
