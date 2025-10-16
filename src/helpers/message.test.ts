import { renderMsg } from './message';

describe('renderMsg', () => {
  it('should render message with reasoning and output tag adjacent correctly', () => {
    const problematicText =
      '<think>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</think>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\nRecupero tutti i 7 parametri dell\'ALBERO ESISTENTE...';

    const result = renderMsg(problematicText, false, 'Reasoning...', true);

    expect(result.text).toBe(
      '<details class="memori-think"><summary>Reasoning...</summary>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</details>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\n<p>Recupero tutti i 7 parametri dell\'ALBERO ESISTENTE...</p>'
    );
  });
});
