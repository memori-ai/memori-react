// POST http://localhost:3000/api/verify-tokens operation=session_creation userID=585ec0ff-e805-495e-b8fc-5b0b8dd288ff tenant=aisuru-staging-tokenized.aclambda.online
export type CreditsOperation =
  | 'twin_creation'
  | 'session_creation'
  | 'import_document'
  // accepted by the API and normalized to session_creation
  | 'dt_session_creation';

export class CreditsCheckError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CreditsCheckError';
    this.status = status;
  }
}

export const getCredits = async ({
  operation = 'session_creation',
  baseUrl,
  userID,
  engineMemoriID,
  tenant,
  characters,
}: {
  operation?: CreditsOperation;
  baseUrl: string;
  userID?: string | null;
  /** Lets the API resolve the agent owner when `userID` is not known. */
  engineMemoriID?: string | null;
  tenant: string;
  characters?: number;
}): Promise<{
  enough: boolean;
  required: number;
  tokens?: number;
}> => {
  if (!userID && !engineMemoriID) {
    throw new CreditsCheckError(
      'Either userID or engineMemoriID must be provided'
    );
  }
  if (operation === 'import_document' && characters == null) {
    throw new CreditsCheckError(
      'characters must be provided for import_document'
    );
  }

  const resp = await fetch(`${baseUrl}/api/verify-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation,
      ...(userID ? { userID } : {}),
      ...(engineMemoriID ? { engineMemoriID } : {}),
      tenant,
      ...(operation === 'import_document' ? { characters } : {}),
    }),
  });

  if (!resp.ok) {
    throw new CreditsCheckError('Failed to fetch credits', resp.status);
  }

  return resp.json();
};
