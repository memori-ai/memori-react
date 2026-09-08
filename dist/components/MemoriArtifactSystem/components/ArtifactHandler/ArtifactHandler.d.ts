import React from 'react';
import { Message } from '@memori.ai/memori-api-client/dist/types';
interface ArtifactHandlerProps {
    isChatlogPanel?: boolean;
    message: Message;
}
declare const MemoizedArtifactHandler: React.NamedExoticComponent<ArtifactHandlerProps>;
export default MemoizedArtifactHandler;
