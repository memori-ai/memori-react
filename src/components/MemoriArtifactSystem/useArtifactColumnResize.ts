import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ARTIFACT_COLUMN_DEFAULT_WIDTH,
  ARTIFACT_COLUMN_MIN_WIDTH,
  ARTIFACT_OVERLAY_BREAKPOINT,
  clampArtifactColumnWidth,
} from '../../helpers/artifactPanel';

/**
 * Width state and drag/keyboard handlers for the side artifact column.
 * `contentRowRef` must point at the row that contains both the chat and the
 * artifact column: its right edge is the anchor for the drag.
 */
export function useArtifactColumnResize(isOpen: boolean) {
  const { t } = useTranslation();
  const [isArtifactOverlay, setIsArtifactOverlay] = useState(false);
  const [artifactColumnWidth, setArtifactColumnWidth] = useState(
    ARTIFACT_COLUMN_DEFAULT_WIDTH
  );
  const [isResizingArtifact, setIsResizingArtifact] = useState(false);
  const contentRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlayQuery = window.matchMedia(
      `(max-width: ${ARTIFACT_OVERLAY_BREAKPOINT - 1}px)`
    );
    const update = () => setIsArtifactOverlay(overlayQuery.matches);
    update();
    overlayQuery.addEventListener('change', update);
    return () => overlayQuery.removeEventListener('change', update);
  }, []);

  const clampToContentRow = useCallback(
    (requestedWidth: number) => {
      const containerWidth =
        contentRowRef.current?.getBoundingClientRect().width ||
        window.innerWidth;
      return clampArtifactColumnWidth(
        requestedWidth,
        containerWidth,
        isArtifactOverlay
      );
    },
    [isArtifactOverlay]
  );

  useEffect(() => {
    if (!isOpen) return;
    setArtifactColumnWidth(current => clampToContentRow(current));
  }, [isOpen, isArtifactOverlay, clampToContentRow]);

  const handleArtifactResizeStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);
      setIsResizingArtifact(true);
    },
    []
  );

  const handleArtifactResizeMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizingArtifact) return;
      const row = contentRowRef.current;
      if (!row) return;
      const nextWidth = row.getBoundingClientRect().right - event.clientX;
      setArtifactColumnWidth(clampToContentRow(nextWidth));
    },
    [clampToContentRow, isResizingArtifact]
  );

  const handleArtifactResizeEnd = useCallback(() => {
    setIsResizingArtifact(false);
  }, []);

  const handleArtifactResizeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 40 : 16;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current + step));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current - step));
      } else if (event.key === 'Home') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current + 200));
      } else if (event.key === 'End') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current - 200));
      }
    },
    [clampToContentRow]
  );

  const columnWidthStyle = isOpen
    ? ({
        ['--memori-artifact-column-width' as string]: `${artifactColumnWidth}px`,
      } as React.CSSProperties)
    : undefined;

  const resizeHandleProps: React.HTMLAttributes<HTMLDivElement> = {
    role: 'separator',
    'aria-orientation': 'vertical',
    'aria-label': t('artifact.resizeHandle') || 'Resize artifact panel',
    'aria-valuemin': ARTIFACT_COLUMN_MIN_WIDTH,
    'aria-valuemax':
      Math.round(contentRowRef.current?.getBoundingClientRect().width || 0) ||
      undefined,
    'aria-valuenow': Math.round(artifactColumnWidth),
    tabIndex: 0,
    onPointerDown: handleArtifactResizeStart,
    onPointerMove: handleArtifactResizeMove,
    onPointerUp: handleArtifactResizeEnd,
    onPointerCancel: handleArtifactResizeEnd,
    onKeyDown: handleArtifactResizeKeyDown,
  };

  return {
    contentRowRef,
    isArtifactOverlay,
    isResizingArtifact,
    columnWidthStyle,
    resizeHandleProps,
  };
}
