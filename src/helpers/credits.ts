// POST http://localhost:3000/api/verify-tokens operation=session_creation userID=585ec0ff-e805-495e-b8fc-5b0b8dd288ff tenant=aisuru-staging-tokenized.aclambda.online
export type CreditsOperation =
  | 'twin_creation'
  | 'session_creation'
  | 'import_document'
  // accepted by the API and normalized to session_creation
  | 'dt_session_creation';

export const getCredits = async ({
  operation = 'session_creation',
  baseUrl,
  userID,
  userName,
  tenant,
  characters,
}: {
  operation?: CreditsOperation;
  baseUrl: string;
  userID?: string | null;
  userName?: string | null;
  tenant: string;
  characters?: number;
}): Promise<{
  enough: boolean;
  required: number;
  tokens?: number;
}> => {
  if (!userID && !userName) {
    throw new Error('Either userID or userName must be provided');
  }
  if (operation === 'import_document' && characters == null) {
    throw new Error('characters must be provided for import_document');
  }

  const resp = await fetch(`${baseUrl}/api/verify-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation,
      userID,
      userName,
      tenant,
      ...(operation === 'import_document' ? { characters } : {}),
    }),
  });

  if (!resp.ok) {
    throw new Error('Failed to fetch credits');
  }

  return resp.json();
};
