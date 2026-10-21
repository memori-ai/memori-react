import React, { useMemo, useState } from 'react';
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

export const getMissingConnectorFields = (
  fields: InstructionConnectorField[],
  values: { [key: string]: string }
) => fields.filter(f => f.required && !values[f.name]?.trim());

const InstructionProposalCard = ({
  medium,
  onConfirm,
  defaultStatus = 'pending',
}: Props) => {
  const { t } = useTranslation();
  const proposal = useMemo(() => parseInstructionProposal(medium), [medium]);
  const [status, setStatus] = useState<InstructionProposalStatus>(
    defaultStatus
  );
  const [lastAction, setLastAction] = useState<boolean>(true);

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

  const renderBody = () => {
    switch (proposal.type) {
      case 'NewContent':
      case 'ContentVariants':
        return (
          <>
            {renderText(t('instructionProposal.question'), proposal.question)}
            {renderText(t('instructionProposal.answer'), proposal.answer)}
            {!!proposal.variants?.length && (
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
            )}
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
              {!!proposal.baseAnswer && (
                <del className="memori-instruction-proposal--text memori-instruction-proposal--removed">
                  {proposal.baseAnswer}
                </del>
              )}
              <ins className="memori-instruction-proposal--text memori-instruction-proposal--added">
                {proposal.answer}
              </ins>
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
          <p className="memori-instruction-proposal--text">
            {t('instructionProposal.promptRevert')}
          </p>
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
            {renderText(
              t('instructionProposal.snippet'),
              proposal.snippetTemplate
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
            {renderText(
              t('instructionProposal.layout'),
              proposal.landingPageLayout
            )}
            {renderText(
              t('instructionProposal.initialQuestion'),
              proposal.initialQuestion
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
        (status === 'pending' || status === 'sending' || status === 'error') && (
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
