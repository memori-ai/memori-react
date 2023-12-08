import { getResourceUrl } from './media';

const tenantID = 'app.memorytwin.com';
const sessionID = 'e995ac6f-8014-4ac0-9992-60fe87ae8b44';
const mediumID = 'a196b513-d745-4121-8913-8f457b999add';

describe('Media URL helper', () => {
  it('Get default avatar URL with no url', async () => {
    expect(
      getResourceUrl({
        type: 'avatar',
        baseURL: 'https://twin.memori.ai',
        apiURL: 'https://backend.memori.ai/api/v2',
      })
    ).toBe('https://twin.memori.ai/images/memoriAvatar.png?v=20231208');
  });
  it('Get default cover URL with no url', async () => {
    expect(
      getResourceUrl({
        type: 'cover',
        apiURL: 'https://backend.memori.ai/api/v2',
        baseURL: 'https://twin.memori.ai',
      })
    ).toBe('https://twin.memori.ai/images/memoriCover.png');
  });

  it('Get correct URL for media', async () => {
    expect(
      getResourceUrl({
        resourceURI:
          'https://assets.memori.ai/api/v2/asset/0eed819c-b496-4419-a9a3-aacbe949bb7c.jpeg/',
        sessionID: sessionID,
        apiURL: 'https://backend.memori.ai/api/v2',
      })
    ).toBe(
      `https://assets.memori.ai/api/v2/asset/0eed819c-b496-4419-a9a3-aacbe949bb7c.jpeg/${sessionID}`
    );
  });

  it('Get correct URL for external media', async () => {
    expect(
      getResourceUrl({
        resourceURI:
          'https://api.lorem.space/image/game?w=150&h=220&hash=8B7BCDC2',
        apiURL: 'https://backend.memori.ai/api/v2',
      })
    ).toBe('https://api.lorem.space/image/game?w=150&h=220&hash=8B7BCDC2');
  });

  it('Get correct URL for old memoriai/memory media', async () => {
    expect(
      getResourceUrl({
        resourceURI:
          'https://backend.memori.ai/api/v1/memoriai/memory/2d434f42-3e95-46ad-9bd5-a10b65977407/media/cloud/studio.memori.ai/2f7b56d1-06a2-4908-9dd3-ef30359b5d05.jpeg',
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
      })
    ).toBe(
      `https://backend.memori.ai/api/v1/memoriai/memory/2d434f42-3e95-46ad-9bd5-a10b65977407/media/cloud/studio.memori.ai/2f7b56d1-06a2-4908-9dd3-ef30359b5d05.jpeg?memori-ai-session-id=${sessionID}`
    );
  });

  it('Get correct URL for old cloud://tenantID media', async () => {
    expect(
      getResourceUrl({
        // cloud://twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
        resourceURI: `cloud://${tenantID}/${mediumID}`,
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
        tenantID: tenantID,
      })
    ).toBe(
      `https://backend.memori.ai/api/v1/CloudAsset/${tenantID}/${mediumID}`
    );
  });

  it('Get correct URL for old cloud://tenantID media', async () => {
    expect(
      getResourceUrl({
        // cloud://twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
        resourceURI: `cloud://twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
`,
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
        tenantID: 'twin.memori.ai',
      })
    ).toBe(
      `https://backend.memori.ai/api/v1/CloudAsset/twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
`
    );
  });

  it('Get correct URL for old cloud://tenantID media', async () => {
    expect(
      getResourceUrl({
        resourceURI:
          'cloud://twin.memori.ai/6c30043c-9de1-4d13-87e4-c53adb3f9885.jpg',
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
        tenantID: 'twin.memori.ai',
      })
    ).toBe(
      `https://backend.memori.ai/api/v1/CloudAsset/twin.memori.ai/6c30043c-9de1-4d13-87e4-c53adb3f9885.jpg`
    );
  });

  it('Get correct URL for old cloud://tenantID media with old non-existent tenant', async () => {
    expect(
      getResourceUrl({
        // cloud://twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
        resourceURI: `cloud://twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
`,
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
        tenantID: 'app.memorytwin.com',
      })
    ).toBe(
      `https://backend.memori.ai/api/v1/CloudAsset/twin.memori.ai/5fc7cd8b-7c8f-4d92-83ad-f48d04b6aafe.jpeg
`
    );
  });

  it('Get correct URL for old guid://tenant media', async () => {
    expect(
      getResourceUrl({
        resourceURI: `guid://${mediumID}`,
        apiURL: 'https://backend.memori.ai/api/v2',
        sessionID: sessionID,
        tenantID: tenantID,
      })
    ).toBe(`https://backend.memori.ai/api/v1/GuidAsset/${mediumID}`);
  });
});
