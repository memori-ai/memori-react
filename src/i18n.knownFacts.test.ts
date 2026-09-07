import i18n from './i18n';

describe('known facts bulk delete translations', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('keeps the selected-rows count in the same language as the confirm message', async () => {
    await i18n.changeLanguage('it');

    const selectedRows = i18n.t('knownFacts.selectedRows', { count: 10 });
    const confirm = i18n.t('knownFacts.deleteSelectedConfirmMessage');
    const message = `${selectedRows}. ${confirm}`;

    expect(selectedRows).toBe('10 righe selezionate');
    expect(message).not.toMatch(/rows selected/i);
    expect(message).toBe(
      '10 righe selezionate. Confermi di voler eliminare i fatti noti selezionati?'
    );
  });

  it.each([
    ['en', 1, '1 row selected'],
    ['en', 10, '10 rows selected'],
    ['it', 1, '1 riga selezionata'],
    ['it', 10, '10 righe selezionate'],
    ['fr', 1, '1 ligne sélectionnée'],
    ['fr', 10, '10 lignes sélectionnées'],
    ['de', 1, '1 Zeile ausgewählt'],
    ['de', 10, '10 Zeilen ausgewählt'],
    ['es', 1, '1 fila seleccionada'],
    ['es', 10, '10 filas seleccionadas'],
  ] as const)(
    'translates %s selectedRows for count %i',
    async (lng, count, expected) => {
      await i18n.changeLanguage(lng);
      expect(i18n.t('knownFacts.selectedRows', { count })).toBe(expected);
    }
  );
});
