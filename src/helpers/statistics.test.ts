import { EventLog, Stats } from '@memori.ai/memori-api-client/dist/types';
import {
  getBadge,
  getNextBadge,
  getPointsForBadge,
  getPointsFromStats,
  getGamificationLevel,
  eventLogGroupUsersByDate,
  getGamificationLevelByStats,
} from './statistics';

export const stats: Stats = {
  totalReceivers: 2,
  receiversWithMemories: 1,
  totalMemories: 50,
  publicMemories: 30,
  memoriesWithMedia: 25,
  totalQuestions: 35,
  publicQuestions: 30,
  questionsWithMoreThanOneAnswer: 20,
  totalStories: 15,
  publicStories: 10,
  storiesWithDate: 5,
  storiesWithPlace: 3,
  storiesWithDateAndPlace: 2,
  unansweredQuestions: 10,
  successfulCorrelations: 5,
  failedCorrelations: 1,
};

export const eventLogs: EventLog[] = [
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e82',
    eventType: 'MemoriOpened',
    ipAddress: '::ffff:10.11.12.14',
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:00:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e83',
    eventType: 'MemoriOpened',
    ipAddress: '::ffff:10.11.12.13',
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:00:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e84',
    eventType: 'MemoriClosed',
    ipAddress: '::ffff:10.11.12.13',
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:10:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e85',
    eventType: 'MemoriOpened',
    ipAddress: '::ffff:10.11.12.13',
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:15:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e86',
    eventType: 'MemoriClosed',
    ipAddress: '::ffff:10.11.12.13',
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:20:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
  {
    eventLogID: '28c9f4c8-d7d5-44c4-9f79-418944b03e88',
    eventType: 'MemoriClosed',
    ipAddress: undefined,
    memoriID: '1afe57c6-1b69-4a61-96ea-52bf7b8d158e',
    timestamp: '2022-04-15T15:28:27.534191',
    userAgent: 'RestSharp/106.13.0.0',
  },
];

describe('getBadge', () => {
  it('should return 🆕 badge for 0 points', () => {
    expect(getBadge(0)).toBe('🆕');
  });
  it('should return 🐹 for 10 points', () => {
    expect(getBadge(10)).toBe('🐹');
  });
  it('should return 🥇 for 99 points', () => {
    expect(getBadge(99)).toBe('🥇');
  });
  it('should return 🥇 for 99.9 points with round', () => {
    expect(getBadge(99.9)).toBe('🥇');
  });
  it('should return 🔥 for 100 points', () => {
    expect(getBadge(100)).toBe('🔥');
  });
  it('should return 🔥 for 101 points', () => {
    expect(getBadge(101)).toBe('🔥');
  });
  it('should return 🌎 for 150 points', () => {
    expect(getBadge(150)).toBe('🌍');
  });
  it('should return 🧠 for 1000 points', () => {
    expect(getBadge(1000)).toBe('🧠');
  });
});

describe('getNextBadge', () => {
  it('should return { points: 10, badge: "🐹" } for 🆕 badge', () => {
    expect(getNextBadge('🆕')).toEqual({ points: 10, badge: '🐹' });
  });
  it('should return { points: 150, badge: "🌍" } for 👾', () => {
    expect(getNextBadge('👾')).toEqual({ points: 150, badge: '🌍' });
  });
  it('should return { points: 600, badge: "🧠" } for ❤', () => {
    expect(getNextBadge('❤️')).toEqual({ points: 600, badge: '🧠' });
  });
});

describe('getPointsForBadge', () => {
  it('should return 0 for "new" badge', () => {
    expect(getPointsForBadge('🆕')).toBe(0);
  });
  it('should return 10 for 🐹', () => {
    expect(getPointsForBadge('🐹')).toBe(10);
  });
  it('should return 150 for 🌎', () => {
    expect(getPointsForBadge('🌍')).toBe(150);
  });
  it('should return 600 for 🧠', () => {
    expect(getPointsForBadge('🧠')).toBe(600);
  });
});

describe('getPointsFromStats', () => {
  it('should return 0 for no stats', () => {
    expect(getPointsFromStats({} as Stats)).toBe(0);
  });
  it('should return x for stats', () => {
    expect(getPointsFromStats(stats)).toBe(68);
  });
});

describe('getGamificationLevel', () => {
  it('should return correct level for 0 points', () => {
    expect(getGamificationLevel(0)).toEqual({
      points: 0,
      badge: '🆕',
      pointsForCurrentBadge: 0,
      nextBadge: { points: 10, badge: '🐹' },
    });
  });
  it('should return correct level with 68 points', () => {
    expect(getGamificationLevel(68.34)).toEqual({
      points: 68,
      badge: '🏅',
      pointsForCurrentBadge: 60,
      nextBadge: { points: 70, badge: '🥉' },
    });
  });
  it('should return correct level with 100 points', () => {
    expect(getGamificationLevel(100)).toEqual({
      points: 100,
      badge: '🔥',
      pointsForCurrentBadge: 100,
      nextBadge: { points: 110, badge: '🎓' },
    });
  });
  it('should return correct level with 68 points and correct float round', () => {
    expect(getGamificationLevel(67.84)).toEqual({
      points: 68,
      badge: '🏅',
      pointsForCurrentBadge: 60,
      nextBadge: { points: 70, badge: '🥉' },
    });
  });
  it('should return correct level with 99.9 points', () => {
    expect(getGamificationLevel(99.9)).toEqual({
      points: 100,
      badge: '🔥',
      pointsForCurrentBadge: 100,
      nextBadge: { points: 110, badge: '🎓' },
    });
  });
  it('should return correct level with overflow 9999 points', () => {
    expect(getGamificationLevel(9999)).toEqual({
      points: 9999,
      badge: '🧠',
      pointsForCurrentBadge: 600,
      nextBadge: undefined,
    });
  });
});

describe('getGamificationLevelByStats', () => {
  it('should return correct level for no stats', () => {
    expect(getGamificationLevelByStats({} as Stats)).toEqual({
      points: 0,
      badge: '🆕',
      pointsForCurrentBadge: 0,
      nextBadge: { points: 10, badge: '🐹' },
    });
  });
  it('should return correct level for stats', () => {
    expect(getGamificationLevelByStats(stats)).toEqual({
      points: 68,
      badge: '🏅',
      pointsForCurrentBadge: 60,
      nextBadge: { points: 70, badge: '🥉' },
    });
  });
});
