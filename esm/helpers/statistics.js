const groupBy = (array, predicate) => array.reduce((acc, value) => {
    if (!acc[predicate(value)]) {
        acc[predicate(value)] = [];
    }
    acc[predicate(value)].push(value);
    return acc;
}, {});
const removeDuplicates = (logs) => {
    const filteredLogs = logs.filter(log => log.eventType === 'MemoriOpened' && log.ipAddress !== null);
    const reducedLogs = filteredLogs.reduce((acc, o) => {
        if (!acc[o.ipAddress]) {
            acc[o.ipAddress] = 0;
        }
        acc[o.ipAddress] += 1;
        return acc;
    }, {});
    return reducedLogs;
};
export const eventLogGroupUsersByDate = (eventLogs) => {
    const mapped = eventLogs.map(event => ({
        ...event,
        timestamp: new Intl.DateTimeFormat('it', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(event.timestamp)),
    }));
    const grouped = groupBy(mapped, v => v.timestamp);
    const userLogs = Object.keys(grouped).map(key => {
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
//# sourceMappingURL=statistics.js.map