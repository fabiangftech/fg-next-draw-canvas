import { defaultStatusStrategy } from '../../../src/strategy/impl/default-status.strategy';

describe('defaultStatusStrategy', () => {
  it('should have default status as default', () => {
    // Assert
    expect(defaultStatusStrategy.defaultStatus).toBe('default');
  });

  it('should return correct style for default status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('default');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#E0E0E0',
      textColor: '#666',
      borderColor: '#BDBDBD'
    });
  });

  it('should return correct style for info status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('info');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#2196F3',
      textColor: 'white',
      borderColor: '#1976D2'
    });
  });

  it('should return correct style for error status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('error');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#F44336',
      textColor: 'white',
      borderColor: '#D32F2F'
    });
  });

  it('should return correct style for warning status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('warning');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#FF9800',
      textColor: 'white',
      borderColor: '#F57C00'
    });
  });

  it('should return default style for unknown status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('unknown');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#9E9E9E',
      textColor: 'white',
      borderColor: '#757575'
    });
  });

  it('should return default style for empty status', () => {
    // Act
    const style = defaultStatusStrategy.getStyle('');

    // Assert
    expect(style).toEqual({
      backgroundColor: '#9E9E9E',
      textColor: 'white',
      borderColor: '#757575'
    });
  });
});
