import {
  Stats,
  GamificationLevel,
  EventLog,
  UsersLog,
  Memori,
  Invitation,
} from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';

const { deleteSession, getStatistics, initSession } = memoriApiClient();

const conversionTable: { [key: string]: number } = {
  totalReceivers: 0.2,
  receiversWithMemories: 0.4,
  totalMemories: 0.2,
  publicMemories: 0.4,
  memoriesWithMedia: 0.4,
  totalQuestions: 0.2,
  publicQuestions: 0.3,
  questionsWithMoreThanOneAnswer: 0.4,
  totalStories: 0.2,
  publicStories: 0.4,
  storiesWithDate: 0.5,
  storiesWithPlace: 0.4,
  storiesWithDateAndPlace: 0.6,
  unansweredQuestions: 0,
  successfulCorrelations: 0,
  failedCorrelations: 0,
};

export const BADGES_MAP: Map<number, string> = new Map([
  [0, '🆕'],
  [10, '🐹'],
  [20, '🐇'],
  [30, '🐰'],
  [40, '💡'],
  [50, '🏆'],
  [60, '🏅'],
  [70, '🥉'],
  [80, '🥈'],
  [90, '🥇'],
  [100, '🔥'],
  [110, '🎓'],
  [120, '🤖'],
  [130, '👾'],
  [150, '🌍'],
  [180, '💜'],
  [200, '💙'],
  [250, '🧡'],
  [300, '💚'],
  [350, '💛'],
  [400, '💖'],
  [450, '💝'],
  [500, '🖤'],
  [550, '❤️'],
  [600, '🧠'],
]);

export const getBadge = (points: number): string => {
  const unlockedBadges = Array.from(BADGES_MAP.keys()).filter(
    (k: number) => k <= points
  );

  if (unlockedBadges.length > 0) {
    const lastBadge = unlockedBadges[unlockedBadges.length - 1];
    return BADGES_MAP.get(lastBadge) as string;
  }

  return '';
};

export const getNextBadge = (
  badge: string
): { points: number; badge: string } | undefined => {
  if (badge === '🆕') {
    return { points: 10, badge: '🐹' };
  }
  let nextBadgePoints;
  let nextBadge;

  let currentSeen = false;
  for (const [key, value] of BADGES_MAP) {
    if (currentSeen) {
      nextBadgePoints = key;
      nextBadge = value;
      break;
    }

    if (value === badge) {
      currentSeen = true;
    }
  }

  return nextBadge && nextBadgePoints
    ? {
        points: nextBadgePoints,
        badge: nextBadge,
      }
    : undefined;
};

export const getPointsForBadge = (badge: string): number => {
  let points = 0;

  for (const [key, value] of BADGES_MAP) {
    if (value === badge) {
      points = key;
      break;
    }
  }

  return points;
};

export const getPointsFromStats = (stats: Stats): number => {
  let points = 0;
  Object.entries(stats).forEach(stat => {
    if (stat[0] in conversionTable) {
      points += stat[1] * conversionTable[stat[0]];
    }
  });
  return Math.trunc(points);
};

export const getGamificationLevel = (points: number): GamificationLevel => {
  const roundedPoints = Math.round(points);
  const badge = getBadge(roundedPoints);
  const pointsForCurrentBadge = getPointsForBadge(badge);
  const nextBadge = getNextBadge(badge);

  return {
    points: roundedPoints,
    badge,
    pointsForCurrentBadge,
    nextBadge,
  };
};

export const getGamificationLevelByStats = (
  stats: Stats
): GamificationLevel => {
  const floatPoints = getPointsFromStats(stats);
  const points = Math.round(floatPoints);
  const badge = getBadge(points);
  const pointsForCurrentBadge = getPointsForBadge(badge);
  const nextBadge = getNextBadge(badge);

  return {
    points,
    badge,
    pointsForCurrentBadge,
    nextBadge,
  };
};

const groupBy = <T>(array: T[], predicate: (v: T) => string) =>
  array.reduce((acc, value) => {
    if (!acc[predicate(value)]) {
      acc[predicate(value)] = [];
    }
    acc[predicate(value)].push(value);
    return acc;
  }, {} as { [key: string]: T[] });

const removeDuplicates = (logs: EventLog[]): { [key: string]: number } => {
  const filteredLogs = logs.filter(
    log => log.eventType === 'MemoriOpened' && log.ipAddress !== null
  );
  const reducedLogs = filteredLogs.reduce(
    (acc: { [key: string]: number }, o) => {
      if (!acc[o.ipAddress as string]) {
        acc[o.ipAddress as string] = 0;
      }
      acc[o.ipAddress as string] += 1;
      return acc;
    },
    {}
  );
  return reducedLogs;
};

export const eventLogGroupUsersByDate = (eventLogs: EventLog[]): UsersLog[] => {
  const mapped = eventLogs.map(event => ({
    ...event,
    timestamp: new Intl.DateTimeFormat('it', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(event.timestamp)),
  }));
  const grouped = groupBy(mapped, v => v.timestamp);

  const userLogs: UsersLog[] = Object.keys(grouped).map(key => {
    const reducedLogs = removeDuplicates(grouped[key]);
    let countRecurrentUsers = 0;
    for (const [, value] of Object.entries(reducedLogs)) {
      if (Number(value) > 1) {
        countRecurrentUsers += 1;
      }
    }
    return {
      timestamp: new Intl.DateTimeFormat('it', {
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(key)),
      countRecurrentUsers,
      countUsers: Object.keys(reducedLogs).length,
    };
  });
  return userLogs;
};

export const getMemoriUnansQuestions = async (memori: Memori) => {
  if (memori.privacyType === 'SECRET' || !memori.isGiver) return 0;
  try {
    if (!memori.giverTag && !!memori.receivedInvitations?.length) {
      let giverInvitation = memori.receivedInvitations.find(
        (i: Invitation) => i.type === 'GIVER' && i.state === 'ACCEPTED'
      );

      if (giverInvitation) {
        memori.giverTag = giverInvitation.tag;
        memori.giverPIN = giverInvitation.pin;
      }
    }

    const { sessionID, currentState, ...response } = await initSession({
      memoriID: memori.engineMemoriID ?? '',
      password: memori.secretToken,
      tag: memori.giverTag,
      pin: memori.giverPIN,
    });

    if (response.resultCode !== 0 || !sessionID) {
      return 0;
    }

    const { statistics, ...resp } = await getStatistics(sessionID);

    await deleteSession(sessionID);

    if (statistics && resp.resultCode === 0) {
      return statistics.unansweredQuestions;
    }

    return 0;
  } catch (e) {
    console.log(e);
    return 0;
  }
};
