import { isMaleExcludedAnimation } from './constants';

describe('isMaleExcludedAnimation', () => {
  it('excludes the unnumbered Idle clip and its Blender duplicate', () => {
    expect(isMaleExcludedAnimation('Idle')).toBe(true);
    expect(isMaleExcludedAnimation('Idle_Armature.003')).toBe(true);
  });

  it('keeps numbered idle variants in the rotation', () => {
    expect(isMaleExcludedAnimation('Idle1')).toBe(false);
    expect(isMaleExcludedAnimation('Idle2')).toBe(false);
    expect(isMaleExcludedAnimation('Idle3')).toBe(false);
    expect(isMaleExcludedAnimation('Idle4')).toBe(false);
    expect(isMaleExcludedAnimation('Idle5')).toBe(false);
    expect(isMaleExcludedAnimation('Idle 1_Armature.003')).toBe(false);
    expect(isMaleExcludedAnimation('Idle 2_Armature.003')).toBe(false);
    expect(isMaleExcludedAnimation('Idle 3_Armature.003')).toBe(false);
  });
});
