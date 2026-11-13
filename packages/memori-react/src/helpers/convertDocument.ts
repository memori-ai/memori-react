type ConvertDocumentResponse = {
  text?: string;
  error?: string;
  originale?: {
    url?: string;
    id?: string;
    scade_il?: string;
  };
  troncato?: boolean;
  /** English alias from the AIsuru proxy. */
  truncated?: boolean;
  /** Characters returned in the extract (`meta.caratteri`). */
  caratteri?: number;
  caratteri_totali?: number;
  tetto_per_connettori?: number;
};

export type ConvertDocumentOptions = {
  sessionID: string;
  memoriID?: string;
  baseUrl?: string;
  /** Asks the conversion API to cut the returned text (`max_caratteri`). */
  maxChars?: number;
};

export type ConvertDocumentResult = {
  text: string;
  /**
   * Signed link to the original file kept by the conversion gateway.
   * Typically expires after ~30 days (`originalExpiresAt` when provided).
   * Prefer this over a text-asset upload so users can download the real file;
   * chat history may lose the link after expiry.
   */
  originalUrl?: string;
  /** ISO expiry of `originalUrl`, when the gateway declares it. */
  originalExpiresAt?: string;
  /** True when the API returned only part of the text. */
  truncated?: boolean;
  /** Length of the extract after stripping the gateway footer (`meta.caratteri`). */
  shownChars?: number;
  /** Length of the full converted text (`meta.caratteri_totali`). */
  totalChars?: number;
  /** Cap applied because the agent has matching file-capable connectors. */
  connectorCap?: number;
};

/** Gateway appends this markdown footer when it truncates; chat replaces it with its own note. */
const GATEWAY_TRUNCATION_FOOTER_RE =
  /\n*\n?>\s*\[conversione troncata a \d+ caratteri su \d+\]\s*$/i;

export function stripGatewayTruncationFooter(text: string): string {
  return text.replace(GATEWAY_TRUNCATION_FOOTER_RE, '').replace(/\s+$/u, '');
}

export const convertDocument = async (
  file: File,
  { sessionID, memoriID, baseUrl = '', maxChars }: ConvertDocumentOptions
): Promise<ConvertDocumentResult> => {
  if (!sessionID) {
    throw new Error('Session ID is required to convert documents');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('session_id', sessionID);
  if (memoriID) {
    body.append('memori_id', memoriID);
  }
  if (maxChars && maxChars > 0) {
    body.append('max_caratteri', String(Math.floor(maxChars)));
  }

  const origin = baseUrl.replace(/\/+$/, '');
  const response = await fetch(
    `${origin}/api/convert/${encodeURIComponent(sessionID)}`,
    {
      method: 'POST',
      body,
    }
  );
  const payload = (await response
    .json()
    .catch(() => null)) as ConvertDocumentResponse | null;

  if (!response.ok || !payload?.text) {
    throw new Error(payload?.error || 'Document conversion failed');
  }

  const originalUrl =
    payload.originale?.url || response.headers?.get?.('X-Originale-Url');

  const truncated = payload.troncato === true || payload.truncated === true;
  const text = truncated
    ? stripGatewayTruncationFooter(payload.text)
    : payload.text;

  const shownChars =
    typeof payload.caratteri === 'number'
      ? payload.caratteri
      : truncated
        ? text.length
        : undefined;

  return {
    text,
    originalUrl: /^https?:\/\//.test(originalUrl || '')
      ? (originalUrl as string)
      : undefined,
    originalExpiresAt: payload.originale?.scade_il,
    truncated,
    shownChars,
    totalChars:
      typeof payload.caratteri_totali === 'number'
        ? payload.caratteri_totali
        : undefined,
    connectorCap:
      typeof payload.tetto_per_connettori === 'number'
        ? payload.tetto_per_connettori
        : undefined,
  };
};
