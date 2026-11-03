import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Medium } from '@memori.ai/memori-api-client/dist/types';
import { Button, Card, Expandable, FieldGroup, Input } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
  InstructionConnectorField,
  InstructionProposal,
  InstructionProposalConfirm,
} from '../../types/instructionProposal';

export type InstructionProposalStatus =
  | 'pending'
  | 'sending'
  | 'applied'
  | 'ignored'
  | 'notPending'
  | 'error';

export interface Props {
  medium: Medium;
  /** Without it the card is read-only */
  onConfirm?: InstructionProposalConfirm;
  defaultStatus?: InstructionProposalStatus;
  /** False when the engine has no proposal pending, confirmed or discarded in chat */
  proposalsPending?: boolean;
}

export const parseInstructionProposal = (
  medium: Medium
): InstructionProposal | null => {
  try {
    const proposal = JSON.parse(medium.content ?? '');
    return proposal?.id && proposal?.type ? proposal : null;
  } catch {
    return null;
  }
};

// Confirmed only with the hints in chat: the agent writes the change in its reply
const CHAT_ONLY_PROPOSAL_TYPES: InstructionProposal['type'][] = [
  'WelcomeMessage',
  'AisuruFunction',
];

export const hasInstructionProposalCard = (medium: Medium) => {
  const proposal = parseInstructionProposal(medium);
  return !!proposal && !CHAT_ONLY_PROPOSAL_TYPES.includes(proposal.type);
};

export const getMissingConnectorFields = (
  fields: InstructionConnectorField[],
  values: { [key: string]: string }
) => fields.filter(f => f.required && !values[f.name]?.trim());

export type WordDiffPart = { text: string; added?: boolean; removed?: boolean };

// Beyond this many word pairs the answers are shown whole, removed and added
const MAX_WORD_DIFF_PAIRS = 250000;

/** Word-level diff of two texts, whitespace kept with the words; null when too long */
export const diffWords = (
  before: string,
  after: string
): WordDiffPart[] | null => {
  const a = before.split(/(\s+)/).filter(x => x.length > 0);
  const b = after.split(/(\s+)/).filter(x => x.length > 0);
  if (a.length * b.length > MAX_WORD_DIFF_PAIRS) return null;

  // Longest common subsequence, from the end
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);

  const parts: WordDiffPart[] = [];
  const add = (text: string, kind: 'same' | 'added' | 'removed') => {
    const last = parts[parts.length - 1];
    const lastKind = !last
      ? null
      : last.added
      ? 'added'
      : last.removed
      ? 'removed'
      : 'same';
    if (last && lastKind === kind) last.text += text;
    else
      parts.push({
        text,
        ...(kind === 'added' ? { added: true } : {}),
        ...(kind === 'removed' ? { removed: true } : {}),
      });
  };

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      add(a[i], 'same');
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) add(a[i++], 'removed');
    else add(b[j++], 'added');
  }
  while (i < a.length) add(a[i++], 'removed');
  while (j < b.length) add(b[j++], 'added');

  return parts;
};

const InstructionProposalCard = ({
  medium,
  onConfirm,
  defaultStatus = 'pending',
  proposalsPending = true,
}: Props) => {
  const { t } = useTranslation();
  const proposal = useMemo(() => parseInstructionProposal(medium), [medium]);
  const [status, setStatus] =
    useState<InstructionProposalStatus>(defaultStatus);
  const [lastAction, setLastAction] = useState<boolean>(true);

  // Only on the change: a card can arrive before the hints of the same reply
  const wasPending = useRef(proposalsPending);
  useEffect(() => {
    if (wasPending.current && !proposalsPending && !!onConfirm)
      setStatus(s => (s === 'pending' || s === 'error' ? 'notPending' : s));
    wasPending.current = proposalsPending;
  }, [proposalsPending, onConfirm]);

  const answerDiff = useMemo(
    () =>
      proposal?.type === 'ContentAnswerChange' && !!proposal.baseAnswer
        ? diffWords(proposal.baseAnswer, proposal.answer ?? '')
        : null,
    [proposal]
  );

  const fields = proposal?.connectorFields ?? [];
  // Secret fields start empty: their values live only here until they are sent
  const [values, setValues] = useState<{ [key: string]: string }>(() =>
    fields.reduce(
      (acc, f) => ({
        ...acc,
        [f.name]: f.secret ? '' : proposal?.connectorParameters?.[f.name] ?? '',
      }),
      {}
    )
  );

  if (!proposal) return null;

  const isConnector = proposal.type === 'Connector';
  const missingFields = getMissingConnectorFields(fields, values);
  const canAct = !!onConfirm && (status === 'pending' || status === 'error');

  const confirm = async (apply: boolean) => {
    if (!onConfirm) return;
    setLastAction(apply);
    setStatus('sending');

    const parameters =
      apply && isConnector
        ? Object.fromEntries(
            Object.entries(values)
              .map(([name, value]) => [name, value.trim()])
              .filter(([, value]) => value.length > 0)
          )
        : undefined;
    setValues(v =>
      Object.fromEntries(
        Object.entries(v).map(([name, value]) => [
          name,
          fields.find(f => f.name === name)?.secret ? '' : value,
        ])
      )
    );

    try {
      const handled = await onConfirm(
        proposal.id,
        apply,
        parameters && Object.keys(parameters).length > 0
          ? parameters
          : undefined
      );
      setStatus(handled ? (apply ? 'applied' : 'ignored') : 'notPending');
    } catch {
      setStatus('error');
    }
  };

  const renderText = (label: string, text?: string) =>
    !!text?.length && (
      <div className="memori-instruction-proposal--section">
        <span className="memori-instruction-proposal--label">{label}</span>
        <p className="memori-instruction-proposal--text">{text}</p>
      </div>
    );

  const renderChange = (label: string, text?: string, previousText?: string) =>
    !previousText || previousText === text ? (
      renderText(label, text)
    ) : (
      <div className="memori-instruction-proposal--section">
        <span className="memori-instruction-proposal--label">{label}</span>
        <p className="memori-instruction-proposal--text">
          <del className="memori-instruction-proposal--removed">
            {previousText}
          </del>{' '}
          <ins className="memori-instruction-proposal--added">{text}</ins>
        </p>
      </div>
    );

  const renderSettingValue = (value: string) =>
    value === 'true'
      ? t('instructionProposal.settingOn')
      : value === 'false'
      ? t('instructionProposal.settingOff')
      : value;

  const renderVariants = () =>
    !!proposal.variants?.length && (
      <div className="memori-instruction-proposal--section">
        <span className="memori-instruction-proposal--label">
          {t('instructionProposal.variants')}
        </span>
        <ul className="memori-instruction-proposal--list">
          {proposal.variants.map(v => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    );

  const renderBody = () => {
    switch (proposal.type) {
      case 'NewContent':
      case 'ContentVariants':
        return (
          <>
            {renderText(t('instructionProposal.question'), proposal.question)}
            {renderText(t('instructionProposal.answer'), proposal.answer)}
            {renderVariants()}
          </>
        );

      case 'ContentAnswerChange':
        return (
          <>
            {renderText(t('instructionProposal.question'), proposal.question)}
            <div className="memori-instruction-proposal--section">
              <span className="memori-instruction-proposal--label">
                {t('instructionProposal.answer')}
              </span>
              {answerDiff ? (
                <p className="memori-instruction-proposal--text">
                  {answerDiff.map((part, index) =>
                    part.removed ? (
                      <del
                        key={index}
                        className="memori-instruction-proposal--removed"
                      >
                        {part.text}
                      </del>
                    ) : part.added ? (
                      <ins
                        key={index}
                        className="memori-instruction-proposal--added"
                      >
                        {part.text}
                      </ins>
                    ) : (
                      <span key={index}>{part.text}</span>
                    )
                  )}
                </p>
              ) : (
                <>
                  {!!proposal.baseAnswer && (
                    <del className="memori-instruction-proposal--text memori-instruction-proposal--removed">
                      {proposal.baseAnswer}
                    </del>
                  )}
                  <ins className="memori-instruction-proposal--text memori-instruction-proposal--added">
                    {proposal.answer}
                  </ins>
                </>
              )}
            </div>
          </>
        );

      case 'PromptChange':
        return (
          <div className="memori-instruction-proposal--section">
            <span className="memori-instruction-proposal--label">
              {t('instructionProposal.prompt')}
            </span>
            <Expandable rows={6}>
              <p className="memori-instruction-proposal--text">
                {proposal.prompt}
              </p>
            </Expandable>
          </div>
        );

      case 'PromptRevert':
        return (
          <>
            <p className="memori-instruction-proposal--text">
              {t('instructionProposal.promptRevert')}
            </p>
            {!!proposal.prompt && (
              <div className="memori-instruction-proposal--section">
                <span className="memori-instruction-proposal--label">
                  {t('instructionProposal.restoredPrompt')}
                </span>
                <Expandable rows={6}>
                  <p className="memori-instruction-proposal--text">
                    {proposal.prompt}
                  </p>
                </Expandable>
              </div>
            )}
          </>
        );

      case 'AttachmentPlacement':
        return (
          <>
            {renderText(
              t('instructionProposal.attachment'),
              proposal.attachmentName
            )}
            {renderText(
              t('instructionProposal.documentTitle'),
              proposal.documentTitle
            )}
          </>
        );

      case 'Snippet':
        return (
          <>
            {renderText(t('instructionProposal.question'), proposal.question)}
            {renderText(t('instructionProposal.answer'), proposal.answer)}
            {renderVariants()}
            {renderText(
              t('instructionProposal.snippet'),
              proposal.snippetTemplate
            )}
            {renderText(
              t('instructionProposal.snippetTitle'),
              proposal.snippetParameters?.title
            )}
            {renderText(
              t('instructionProposal.snippetText'),
              proposal.snippetParameters?.text
            )}
            {renderText(
              t('instructionProposal.snippetSubmitLabel'),
              proposal.snippetParameters?.submit_label
            )}
            {renderText(
              t('instructionProposal.snippetSelector'),
              proposal.snippetParameters?.selector
            )}
            {!!proposal.snippetFields?.length && (
              <div className="memori-instruction-proposal--section">
                <span className="memori-instruction-proposal--label">
                  {t('instructionProposal.snippetFields')}
                </span>
                <ul className="memori-instruction-proposal--list">
                  {proposal.snippetFields.map(f => (
                    <li key={f.name}>{f.label || f.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      case 'LandingPage':
        return (
          <>
            {renderChange(
              t('instructionProposal.layout'),
              proposal.landingPageLayout,
              proposal.previousLandingPageLayout
            )}
            {renderChange(
              t('instructionProposal.initialQuestion'),
              proposal.initialQuestion,
              proposal.previousInitialQuestion
            )}
            {!!proposal.landingPageSettings &&
              Object.keys(proposal.landingPageSettings).length > 0 && (
                <div className="memori-instruction-proposal--section">
                  <span className="memori-instruction-proposal--label">
                    {t('instructionProposal.pageSettings')}
                  </span>
                  <ul className="memori-instruction-proposal--list">
                    {Object.entries(proposal.landingPageSettings).map(
                      ([name, value]) => {
                        const previousValue =
                          proposal.previousLandingPageSettings?.[name];
                        return (
                          <li key={name}>
                            {t(`instructionProposal.pageSettingNames.${name}`, {
                              defaultValue: name,
                            })}
                            :{' '}
                            {!!previousValue && (
                              <>
                                <del className="memori-instruction-proposal--removed">
                                  {renderSettingValue(previousValue)}
                                </del>{' '}
                              </>
                            )}
                            <ins className="memori-instruction-proposal--added">
                              {renderSettingValue(value)}
                            </ins>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}
          </>
        );

      case 'Connector':
        return (
          <>
            {!!proposal.connectorDescription && (
              <p className="memori-instruction-proposal--text">
                {proposal.connectorDescription}
              </p>
            )}
            {fields.length > 0 && (
              <form
                className="memori-instruction-proposal--form"
                autoComplete="off"
                onSubmit={e => {
                  e.preventDefault();
                  if (canAct && missingFields.length === 0) confirm(true);
                }}
              >
                {fields.map(f => (
                  <FieldGroup
                    key={f.name}
                    label={f.name}
                    helperText={
                      f.secret
                        ? [f.description, t('instructionProposal.secretField')]
                            .filter(Boolean)
                            .join(' ')
                        : f.description
                    }
                    required={f.required}
                  >
                    <Input
                      name={f.name}
                      type={f.secret ? 'password' : 'text'}
                      autoComplete={f.secret ? 'new-password' : 'off'}
                      placeholder={f.secret ? undefined : f.example}
                      value={values[f.name] ?? ''}
                      disabled={!canAct}
                      fullWidth
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValues(v => ({ ...v, [f.name]: e.target.value }))
                      }
                    />
                  </FieldGroup>
                ))}
              </form>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'applied':
        return t(
          isConnector
            ? 'instructionProposal.linked'
            : 'instructionProposal.applied'
        );
      case 'ignored':
        return t('instructionProposal.ignored');
      case 'notPending':
        return t('instructionProposal.notPending');
      case 'error':
        return t('instructionProposal.error');
      default:
        return null;
    }
  };

  const statusText = renderStatus();

  return (
    <Card
      variant="outlined"
      padding="md"
      className={cx(
        'memori-instruction-proposal',
        `memori-instruction-proposal--${status}`
      )}
      title={
        <span className="memori-instruction-proposal--header">
          <span className="memori-instruction-proposal--type">
            {t(`instructionProposal.types.${proposal.type}`)}
          </span>
          {!!medium.title && (
            <span className="memori-instruction-proposal--title">
              {medium.title}
            </span>
          )}
        </span>
      }
    >
      {!!proposal.reason && (
        <p className="memori-instruction-proposal--reason">{proposal.reason}</p>
      )}
      {renderBody()}
      {!!statusText && (
        <p
          className="memori-instruction-proposal--status"
          role={status === 'error' ? 'alert' : 'status'}
        >
          {statusText}
        </p>
      )}
      {!!onConfirm &&
        (status === 'pending' ||
          status === 'sending' ||
          status === 'error') && (
          <div className="memori-instruction-proposal--actions">
            <Button
              variant="primary"
              size="sm"
              disabled={!canAct || missingFields.length > 0}
              loading={status === 'sending' && lastAction}
              onClick={() => confirm(true)}
            >
              {t(
                isConnector
                  ? 'instructionProposal.link'
                  : 'instructionProposal.apply'
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAct}
              loading={status === 'sending' && !lastAction}
              onClick={() => confirm(false)}
            >
              {t('instructionProposal.ignore')}
            </Button>
          </div>
        )}
      {canAct && isConnector && missingFields.length > 0 && (
        <p className="memori-instruction-proposal--hint">
          {t('instructionProposal.fillRequired', {
            fields: missingFields.map(f => f.name).join(', '),
          })}
        </p>
      )}
    </Card>
  );
};

export default InstructionProposalCard;
