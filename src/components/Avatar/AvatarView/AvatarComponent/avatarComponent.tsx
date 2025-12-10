import { useRef, useEffect, useCallback, memo } from 'react';
import { AvatarAnimator } from './components/controllers/AvatarAnimator';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';

interface AvatarViewProps {
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

// Memoized FullbodyAvatar component to prevent unnecessary re-renders
const MemoizedFullbodyAvatar = memo(FullbodyAvatar);

// Memoized HalfBodyAvatar component to prevent unnecessary re-renders
const MemoizedHalfBodyAvatar = memo(HalfBodyAvatar);

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
  showControls,
}: AvatarViewProps) => {
  // Reference to the AvatarAnimator instance for animation control
  const animatorRef = useRef<AvatarAnimator | null>(null);

  // Memoize the setAnimatorRef callback to ensure it doesn't change on re-renders
  const setAnimatorRef = useCallback((animator: AvatarAnimator | null) => {
    if (animator !== animatorRef.current) {
      animatorRef.current = animator;
    }
  }, []); // Empty dependency array ensures this function never changes

  // React to changes in chat emission or loading state
  // This effect doesn't re-create the animator, it just uses it
  useEffect(() => {
    if (!animatorRef.current) return;
    
    try {
      // Prevents any extra work if loading/emission hasn't changed
      animatorRef.current.processChatEmission(chatEmission, loading);
    } catch (error) {
      console.error('Error processing chat emission:', error);
    }
  }, [loading, chatEmission]); // Both dependencies are needed

  // Memoize common props to prevent unnecessary object creation on re-renders
  const commonAvatarProps = useCallback(() => ({
    url,
    onCameraZChange: setCameraZ,
    updateCurrentViseme,
    avatarHeight,
    avatarDepth,
    setAnimatorRef, // This is now stable across renders
  }), [url, setCameraZ, updateCurrentViseme, avatarHeight, avatarDepth, setAnimatorRef]);

  // Render avatar based on halfBody flag
  return (
    <>
      {halfBody ? (
        <MemoizedHalfBodyAvatar
          {...commonAvatarProps()}
          eyeBlink={eyeBlink}
          headMovement={headMovement}
        />
      ) : (
        <MemoizedFullbodyAvatar
          {...commonAvatarProps()}
          sex={sex}
          eyeBlink={eyeBlink}
          chatEmission={chatEmission}
          loading={loading}
        />
      )}
      {showControls && animatorRef.current && (
        <div className="animation-controls">
          {/* Optional animation control UI could be added here */}
        </div>
      )}
    </>
  );
};

export default memo(AvatarView); // Memoize the entire component