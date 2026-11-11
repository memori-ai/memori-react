import { EventLog, UsersLog } from '@memori.ai/memori-api-client/dist/types';

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
