import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
import { Button, useMemoriTheme, usePortalContainer } from '@memori.ai/ui';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SideDrawerProps {
  open?: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Explicit panel width. Overrides `size` on the right-edge drawer.
   */
  width?: string | number;
  loading?: boolean;
  closeLabel?: string;
}

const DEFAULT_SIDE_DRAWER_WIDTH = '450px';

type ActiveDrawerCloseRef = {
  id: string;
  close: () => void;
};

let activeSideDrawer: ActiveDrawerCloseRef | null = null;

const toCssLength = (value?: string | number): string => {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_SIDE_DRAWER_WIDTH;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

/**
 * Shared shell for the chat side drawers: header (title + close),
 * scrollable body, optional footer.
 *
 * When mounted inside a FullPage, ZoomedFullBody, or Chat layout, the drawer
 * portals into the content row below the top header and acts as a 400px push
 * panel so the header stays visible and the chat area shrinks without being
 * covered. Elsewhere (standalone tests, WebsiteAssistant, Totem), it portals
 * into the nearest portal container or `document.body`.
 */
const SideDrawer: React.FC<SideDrawerProps> = ({
  open = true,
  onClose,
  title,
  description,
  footer,
  children,
  className,
  size = 'md',
  width = DEFAULT_SIDE_DRAWER_WIDTH,
  loading = false,
  closeLabel,
}) => {
  const { t } = useTranslation();
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const clipContainer = usePortalContainer(undefined, 'clip');
  const resolvedTheme = useMemoriTheme();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isPushTarget, setIsPushTarget] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!open) {
      setPortalTarget(null);
      setIsPushTarget(false);
      return;
    }

    const searchRoot = clipContainer ?? document;
    const contentRow = searchRoot.querySelector<HTMLElement>(
      '.memori-fullpage-content-row, .memori-spin.memori-chat-layout > .memori-chat-layout--main, .memori-chat-layout > .memori-chat-layout--main'
    );

    if (contentRow) {
      setPortalTarget(contentRow);
      setIsPushTarget(true);
    } else {
      setPortalTarget(clipContainer ?? document.body);
      setIsPushTarget(false);
    }
  }, [open, clipContainer]);

  useEffect(() => {
    if (!open) {
      if (activeSideDrawer?.id === baseId) {
        activeSideDrawer = null;
      }
      return;
    }

    if (activeSideDrawer && activeSideDrawer.id !== baseId) {
      activeSideDrawer.close();
    }

    activeSideDrawer = {
      id: baseId,
      close: () => onCloseRef.current(),
    };

    return () => {
      if (activeSideDrawer?.id === baseId) {
        activeSideDrawer = null;
      }
    };
  }, [open, baseId]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const resolvedWidth = useMemo(() => toCssLength(width), [width]);
  const resolvedCloseLabel =
    closeLabel ??
    String(t('overlay.closeDrawer', { defaultValue: 'Close drawer' }));

  if (!open) return null;

  const target =
    portalTarget ??
    (typeof document !== 'undefined'
      ? clipContainer?.querySelector<HTMLElement>(
          '.memori-fullpage-content-row, .memori-spin.memori-chat-layout > .memori-chat-layout--main, .memori-chat-layout > .memori-chat-layout--main'
        ) ??
        clipContainer ??
        document.body
      : null);

  if (!target) return null;

  const isTargetPush =
    isPushTarget ||
    target.classList.contains('memori-fullpage-content-row') ||
    target.classList.contains('memori-chat-layout--main');

  const drawerNode = (
    <div
      role="dialog"
      aria-modal={false}
      aria-labelledby={title != null ? titleId : undefined}
      aria-describedby={description != null ? descriptionId : undefined}
      data-theme={resolvedTheme}
      data-custom-width=""
      data-push-drawer={isTargetPush ? '' : undefined}
      className={cx(
        'memori-drawer',
        'memori-drawer--right',
        `memori-drawer--size-${size}`,
        'memori-side-drawer',
        {
          'memori-side-drawer--push': isTargetPush,
          'memori-drawer--loading': loading,
        },
        className
      )}
      style={
        {
          '--memori-drawer-width': resolvedWidth,
        } as React.CSSProperties
      }
    >
      {(title != null || description != null || true) && (
        <div className="memori-drawer__header">
          <div>
            {title != null && (
              <h2 id={titleId} className="memori-drawer__title">
                {title}
              </h2>
            )}
            {description != null && (
              <p id={descriptionId} className="memori-drawer__description">
                {description}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            shape="circle"
            className="memori-drawer__close"
            aria-label={resolvedCloseLabel}
            icon={<X size={18} aria-hidden />}
            onClick={onClose}
          />
        </div>
      )}

      <div className="memori-drawer__body">
        <div className="memori-side-drawer__body">{children}</div>
      </div>

      {footer != null && <div className="memori-drawer__footer">{footer}</div>}
    </div>
  );

  return createPortal(
    drawerNode as unknown as Parameters<typeof createPortal>[0],
    target
  );
};

export interface SideDrawerEmptyProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export const SideDrawerEmpty: React.FC<SideDrawerEmptyProps> = ({
  icon,
  title,
  description,
  children,
}) => (
  <div className="memori-side-drawer-empty" role="status">
    {icon != null && (
      <span className="memori-side-drawer-empty__icon" aria-hidden>
        {icon}
      </span>
    )}
    <p className="memori-side-drawer-empty__title">{title}</p>
    {description != null && (
      <p className="memori-side-drawer-empty__text">{description}</p>
    )}
    {children}
  </div>
);

export default SideDrawer;
