/**
 * Changes the engine proposes while the Giver instructs the Agent.
 * Each one arrives as a medium with INSTRUCTION_PROPOSAL_MIME_TYPE, whose content is the
 * proposal as JSON and whose ID is the ID of the proposal. Secrets are never in it.
 */

export type InstructionProposalType =
  | 'NewContent'
  | 'ContentVariants'
  | 'PromptChange'
  | 'PromptRevert'
  | 'AttachmentPlacement'
  | 'ContentAnswerChange'
  | 'Snippet'
  | 'LandingPage'
  | 'Connector';

export interface InstructionSnippetField {
  name: string;
  label?: string;
  type?: string;
}

/** A field of a connector the Giver fills: the secret ones only in the proposal, never in chat. */
export interface InstructionConnectorField {
  name: string;
  type?: string;
  description?: string;
  example?: string;
  required?: boolean;
  secret?: boolean;
}

export interface InstructionProposal {
  id: string;
  type: InstructionProposalType;
  reason?: string;
  question?: string;
  answer?: string;
  /** The answer the proposal was written on, for ContentAnswerChange */
  baseAnswer?: string;
  variants?: string[];
  prompt?: string;
  attachmentName?: string;
  documentTitle?: string;
  snippetTemplate?: string;
  snippetParameters?: { [key: string]: string };
  snippetFields?: InstructionSnippetField[];
  landingPageLayout?: string;
  initialQuestion?: string;
  connectorSchemaID?: string;
  connectorName?: string;
  connectorDescription?: string;
  connectorFields?: InstructionConnectorField[];
  /** The values given in chat, never the secret ones */
  connectorParameters?: { [key: string]: string };
}

/**
 * Confirms a proposal. Resolves true when the engine handled it, false when the proposal
 * was no longer pending (already applied, discarded or unknown); rejects on errors.
 */
export type InstructionProposalConfirm = (
  proposalID: string,
  apply: boolean,
  parameters?: { [key: string]: string }
) => Promise<boolean>;
