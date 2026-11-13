import { getChatStyles } from './MemoriWidget';

describe('getChatStyles', () => {
  it('returns empty object when no brand primary is set', () => {
    expect(getChatStyles(undefined)).toEqual({});
    expect(getChatStyles({})).toEqual({});
  });

  it('sets only the brand hook and widget-domain icon tokens', () => {
    const styles = getChatStyles({
      buttonBgColor: '#8246af',
      buttonTextColor: '#fff',
    });

    expect(styles).toMatchObject({
      '--memori-primary-color': '#8246af',
      '--memori-primary-content': '#fff',
    });
    expect(styles).not.toHaveProperty('--memori-primary-hover');
    expect(styles).not.toHaveProperty('--memori-primary-active');
    expect(styles).toHaveProperty('--memori-icon-active-bg');
    expect(styles).toHaveProperty('--memori-icon-recording-bg');
  });
});
