// POST http://localhost:3000/api/verify-tokens operation=session_creation userID=585ec0ff-e805-495e-b8fc-5b0b8dd288ff tenant=aisuru-staging-tokenized.aclambda.online
export const getCredits = async ({
  operation = 'session_creation',
  baseUrl,
  userID,
  userName,
  tenant,
}: {
  operation?: string;
  baseUrl: string;
  userID?: string | null;
  userName?: string | null;
  tenant: string;
}): Promise<{
  enough: boolean;
  required: number;
}> => {
  if (!userID && !userName) {
    throw new Error('Either userID or userName must be provided');
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
    }),
  });

  if (!resp.ok) {
    throw new Error('Failed to fetch credits');
  }

  return resp.json();
};
