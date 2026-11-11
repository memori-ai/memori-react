import {
  formatConversationListDate,
  getConversationGroupKey,
  getLastMessageDate,
  groupConversations,
} from './conversationHistory';

const NOW = new Date('2026-09-19T10:00:00.000Z');

describe('formatConversationListDate', () => {
  it('uses yesterday plus the time', () => {
    const formatted = formatConversationListDate(
      '2026-09-18T14:30:00.000Z',
      'it',
      NOW
    );
    expect(formatted.toLowerCase()).toContain('ier');
    expect(formatted).toMatch(/14:30|2:30/);
  });

  it('uses a compact day and month for older dates', () => {
    const formatted = formatConversationListDate(
      '2026-09-12T17:20:00.000Z',
      'it',
      NOW
    );
    expect(formatted).toMatch(/12/);
    expect(formatted.toLowerCase()).toMatch(/set/);
  });
});

describe('conversation grouping', () => {
  it('puts current-week dates in thisWeek and older ones in a month bucket', () => {
    expect(
      getConversationGroupKey(new Date('2026-09-16T09:12:00.000Z'), NOW)
    ).toEqual({
      type: 'thisWeek',
    });
    expect(
      getConversationGroupKey(new Date('2026-09-09T11:04:00.000Z'), NOW)
    ).toEqual({
      type: 'month',
      year: 2026,
      month: 8,
    });
  });

  it('keeps recency order inside each group', () => {
    const grouped = groupConversations(
      [
        { id: 'a', at: new Date('2026-09-18T14:30:00.000Z') },
        { id: 'b', at: new Date('2026-09-16T09:12:00.000Z') },
        { id: 'c', at: new Date('2026-09-12T17:20:00.000Z') },
      ],
      item => item.at,
      NOW
    );

    expect(grouped.map(group => group.key)).toEqual([
      { type: 'thisWeek' },
      { type: 'month', year: 2026, month: 8 },
    ]);
    expect(grouped[0].items.map(item => item.id)).toEqual(['a', 'b']);
    expect(grouped[1].items.map(item => item.id)).toEqual(['c']);
  });
});

describe('getLastMessageDate', () => {
  it('uses the latest line timestamp', () => {
    expect(
      getLastMessageDate([
        { timestamp: '2026-09-16T09:00:00.000Z' },
        { timestamp: '2026-09-16T09:12:00.000Z' },
      ])?.toISOString()
    ).toBe('2026-09-16T09:12:00.000Z');
  });
});
