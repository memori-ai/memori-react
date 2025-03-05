import { useRef } from 'react';
import { useEffect } from 'react';
import { AvatarAnimator } from './components/controllers/AvatarAnimator';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
interface Props {
  chatEmission: string | null | undefined;
  url: string;
  sex: 'MALE' | 'FEMALE';
  eyeBlink: boolean;
  halfBody: boolean;
  loading: boolean;
  avatarHeight: number;
  avatarDepth: number;
  updateCurrentViseme: (
    currentTime: number
  ) => { name: string; weight: number } | null;
  setCameraZ: (cameraZ: number) => void;
  headMovement: boolean;
  speaking: boolean;
  showControls: boolean;
}

export const AvatarView = ({
  chatEmission,
  url,
  sex,
  eyeBlink,
  halfBody,
  loading,
  avatarHeight = 50,
  avatarDepth = -50,
  updateCurrentViseme,
  setCameraZ,
  headMovement,
  // speaking,
  // showControls,
}: Props) => {
  // Reference to the AvatarAnimator instance
  const animatorRef = useRef<AvatarAnimator | null>(null);

  // React to changes in chat emission or loading state
  useEffect(() => {
    if (!animatorRef.current) return;

    try {
      // Let the animator handle the extraction and animation
      animatorRef.current.processChatEmission(chatEmission, loading);
    } catch (error) {
      console.error('Error processing chat emission:', error);
    }
  }, [loading, chatEmission]); // Both dependencies are needed

  // Common props shared between full body and half body avatars
  const commonAvatarProps = {
    url,
    onCameraZChange: setCameraZ,
    updateCurrentViseme,
    avatarHeight,
    avatarDepth,
  };

  // Render avatar based on halfBody flag
  return (
    <>
      {halfBody ? (
        <HalfBodyAvatar {...commonAvatarProps} eyeBlink={eyeBlink} headMovement={headMovement} />
      ) : (
        <FullbodyAvatar
          {...commonAvatarProps}
          sex={sex}
          eyeBlink={eyeBlink}
          chatEmission={chatEmission}
          loading={loading}
        />
      )}
    </>
  );
};
