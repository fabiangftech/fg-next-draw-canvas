import { defaultIconStrategy } from '../../../src/strategy/impl/default-icon.strategy';

describe('defaultIconStrategy', () => {
  it('should have useLetters set to true', () => {
    // Assert
    expect(defaultIconStrategy.useLetters).toBe(true);
  });

  it('should return undefined for empty iconCode', () => {
    // Act
    const result = defaultIconStrategy.getIcon();

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return undefined for null iconCode', () => {
    // Act
    const result = defaultIconStrategy.getIcon(null);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return first letter capitalized for single character', () => {
    // Act
    const result = defaultIconStrategy.getIcon('a');

    // Assert
    expect(result).toBe('A');
  });

  it('should return first letter capitalized for multiple characters', () => {
    // Act
    const result = defaultIconStrategy.getIcon('hello');

    // Assert
    expect(result).toBe('H');
  });

  it('should handle already capitalized letters', () => {
    // Act
    const result = defaultIconStrategy.getIcon('Test');

    // Assert
    expect(result).toBe('T');
  });

  it('should handle special characters', () => {
    // Act
    const result = defaultIconStrategy.getIcon('@special');

    // Assert
    expect(result).toBe('@');
  });

  it('should handle numbers', () => {
    // Act
    const result = defaultIconStrategy.getIcon('123');

    // Assert
    expect(result).toBe('1');
  });
});
