# Chat Attachment Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Group user chat attachments with their message bubble and render typed cards (image, data, file, HTML preview) with correct extension badges.

**Architecture:** Move user `MediaWidget` into a right-aligned user column with an attachment strip in `ChatBubble`. Differentiate card UIs in `MediaItemWidget` / `DocumentCard`. Detect data cards by MIME only (`application/json`, `text/csv`, `text/xml`, `application/xml`). Prefer filename/URL extension for badges via `getDocumentBadgeLabel`.

**Tech Stack:** React, TypeScript, Jest + Testing Library, existing `--memori-*` CSS tokens, `@memori.ai/ui` Card where already used.

## Global Constraints

- Scope: attachment rendering only — do not change send/upload/state management.
- Tokens: existing `--memori-*` only; no mockup hex palette as new brand tokens.
- Data cards: MIME-based only (option A).
- Agent media: leave left-aligned, no strip.
- Leave unrelated Safari scroll WIP alone unless selectors conflict.
- Match `memori-chat--*` / `memori-media-*` naming.

## File map

| File | Responsibility |
|------|----------------|
| `src/components/MediaWidget/MediaItemWidget.utils.ts` | Data-MIME helpers + preview row parsing; badge already prefers extension |
| `src/components/MediaWidget/DocumentCard.tsx` | File card shell: icon, title, meta, badge |
| `src/components/MediaWidget/MediaItemWidget.tsx` | Image caption, data card, HTML open-preview, wire DocumentCard |
| `src/components/MediaWidget/MediaItemWidget.css` | Strip-friendly grid + card variant styles |
| `src/components/ChatBubble/ChatBubble.tsx` | User column + attachment strip wrapping MediaWidget |
| `src/components/ChatBubble/ChatBubble.css` | User-block / strip layout |

---

### Task 1: Utils — data MIME helpers + badge regression

**Files:**
- Modify: `src/components/MediaWidget/MediaItemWidget.utils.ts`
- Test: `src/components/MediaWidget/MediaItemWidget.utils.test.ts`

**Interfaces:**
- Produces:
  - `DATA_PREVIEW_MIME_TYPES: readonly string[]`
  - `isDataPreviewMime(mimeType: string): boolean`
  - `parseDataPreviewRows(content: string | undefined, mimeType: string): { label: string; value: string }[]` (max 4 rows; empty array if unparseable)

- [ ] **Step 1: Write failing tests**

Add to `MediaItemWidget.utils.test.ts`:

```ts
describe('isDataPreviewMime', () => {
  it('returns true for json/csv/xml mimes', () => {
    expect(isDataPreviewMime('application/json')).toBe(true);
    expect(isDataPreviewMime('text/csv')).toBe(true);
    expect(isDataPreviewMime('text/xml')).toBe(true);
    expect(isDataPreviewMime('application/xml')).toBe(true);
  });
  it('returns false for plain text and pdf', () => {
    expect(isDataPreviewMime('text/plain')).toBe(false);
    expect(isDataPreviewMime('application/pdf')).toBe(false);
  });
});

describe('parseDataPreviewRows', () => {
  it('parses json object keys', () => {
    expect(parseDataPreviewRows('{"a":1,"b":"x"}', 'application/json')).toEqual([
      { label: 'a', value: '1' },
      { label: 'b', value: 'x' },
    ]);
  });
  it('returns [] for unparseable content', () => {
    expect(parseDataPreviewRows('not-json', 'application/json')).toEqual([]);
  });
});

describe('getDocumentBadgeLabel PDF vs wrong mime', () => {
  it('uses filename extension over text/plain mime', () => {
    expect(
      getDocumentBadgeLabel('text/plain', 'checklist-produzione-set.pdf')
    ).toBe('PDF');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `yarn test src/components/MediaWidget/MediaItemWidget.utils.test.ts -t "isDataPreviewMime|parseDataPreviewRows|PDF vs wrong"`

- [ ] **Step 3: Implement helpers**

In `MediaItemWidget.utils.ts`:

```ts
export const DATA_PREVIEW_MIME_TYPES = [
  'application/json',
  'text/csv',
  'text/xml',
  'application/xml',
] as const;

export function isDataPreviewMime(mimeType: string): boolean {
  const normalized = normalizeMimeType(mimeType).toLowerCase();
  return (DATA_PREVIEW_MIME_TYPES as readonly string[]).includes(normalized);
}

export function parseDataPreviewRows(
  content: string | undefined,
  mimeType: string
): { label: string; value: string }[] {
  if (!content?.trim()) return [];
  const normalized = normalizeMimeType(mimeType).toLowerCase();
  try {
    if (normalized === 'application/json') {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.entries(parsed)
          .slice(0, 4)
          .map(([label, value]) => ({
            label,
            value: value == null ? '' : String(value),
          }));
      }
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 4).map((row, i) => ({
          label: String(i),
          value: typeof row === 'object' ? JSON.stringify(row) : String(row),
        }));
      }
      return [];
    }
    if (normalized === 'text/csv') {
      return content
        .trim()
        .split(/\r?\n/)
        .slice(0, 4)
        .map(line => {
          const [label, ...rest] = line.split(',');
          return { label: label?.trim() ?? '', value: rest.join(',').trim() };
        });
    }
    if (normalized === 'text/xml' || normalized === 'application/xml') {
      const pairs = [
        ...content.matchAll(/<([A-Za-z_][\w.-]*)>([^<]{1,80})<\/\1>/g),
      ].slice(0, 4);
      return pairs.map(m => ({ label: m[1], value: m[2].trim() }));
    }
  } catch {
    return [];
  }
  return [];
}
```

Export `normalizeMimeType` if needed for tests, or keep it module-private and use via helpers only.

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/MediaWidget/MediaItemWidget.utils.ts src/components/MediaWidget/MediaItemWidget.utils.test.ts
git commit -m "feat(media): add data-preview MIME helpers and badge regression"
```

---

### Task 2: DocumentCard renders icon + meta

**Files:**
- Modify: `src/components/MediaWidget/DocumentCard.tsx`
- Modify: `src/components/MediaWidget/MediaItemWidget.css` (file-card layout: icon block + meta)
- Test: `src/components/MediaWidget/DocumentCard.test.tsx`
- Snapshot: `src/components/MediaWidget/__snapshots__/DocumentCard.test.tsx.snap`

**Interfaces:**
- Consumes: `DocumentCardProps { title, badge, meta?, icon }`
- Produces: DOM with `.memori-media-item--document-icon`, `.memori-media-item--document-meta` when meta set

- [ ] **Step 1: Failing test for icon + meta**

```ts
it('renders icon and meta when provided', () => {
  render(
    <DocumentCard
      title="report.pdf"
      badge="PDF"
      meta="240 KB"
      icon={<File data-testid="doc-icon" />}
    />
  );
  expect(screen.getByTestId('doc-icon')).toBeInTheDocument();
  expect(screen.getByText('240 KB')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement DocumentCard**

```tsx
export function DocumentCard({
  title,
  badge,
  meta,
  icon,
}: DocumentCardProps): React.ReactElement {
  return (
    <div className="memori-media-item--document">
      <div className="memori-media-item--document-header">
        <div className="memori-media-item--document-icon" aria-hidden>
          {icon}
        </div>
        <div className="memori-media-item--document-body">
          <div className="memori-media-item--document-title">{title}</div>
          {meta ? (
            <div className="memori-media-item--document-meta">{meta}</div>
          ) : null}
        </div>
        <span className="memori-media-item--document-badge">{badge}</span>
      </div>
    </div>
  );
}
```

Restyle so badge sits as colored icon text OR keep badge as extension chip on the icon block (match mockup: colored square with PDF/TXT text). Prefer: put badge text inside the icon block when using type-colored backgrounds via modifier class `memori-media-item--document-badge--{ext}` — if too large, keep badge as the icon content (replace Lucide File with badge text for file types). Spec: “colored icon block (badge from real extension) + filename + meta”. So:

```tsx
<div className={cx('memori-media-item--document-icon', `memori-media-item--document-icon--${badge.toLowerCase()}`)}>
  {badge}
</div>
```

Keep `icon` prop for API compatibility but prefer showing `badge` text in the colored block (mockup). Still accept `icon` as fallback when badge empty.

Update CSS: horizontal flex card (not 120×120 tall dark tile for files inside strip); light card background `var(--memori-main-background)`; soft border `var(--memori-border-color)`; icon 34px square with type colors via modifiers for pdf/txt/html/json/csv/xml/default using `color-mix` on semantic hues or existing primary/error tokens — keep minimal: `--memori-primary` for html, a red-ish mix for pdf, blue-ish for txt without new brand tokens (use `color-mix` with `red`/`blue`/`teal` CSS named colors mixed with primary if needed is OK for type chips).

- [ ] **Step 4: Update snapshot + PASS tests**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(media): render DocumentCard icon block and meta"
```

---

### Task 3: MediaItemWidget card variants

**Files:**
- Modify: `src/components/MediaWidget/MediaItemWidget.tsx`
- Modify: `src/components/MediaWidget/MediaItemWidget.css`
- Test: `src/components/MediaWidget/MediaItemWidget.test.tsx` (add focused cases)

**Interfaces:**
- Consumes: `isDataPreviewMime`, `parseDataPreviewRows`, `getDocumentBadgeLabel`
- Produces:
  - Image cards with `.memori-media-item--image-caption`
  - Data cards with `.memori-media-item--data-preview`
  - HTML preview cards with `.memori-media-item--html-preview` and visible “Open preview” (English fallback string `Open preview`)

- [ ] **Step 1: Add failing tests** for:
  - image caption visible when title set
  - JSON medium renders data preview rows (not DocumentCard badge-only)
  - HTML with url renders Open preview link text
  - PDF filename with text/plain mime shows PDF badge

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement branches in `RenderMediaItem`**

Order of checks (before generic file card):

1. Image MIME → existing image render + caption under thumb (`{title} — {badge}`).
2. `isDataPreviewMime` + `parseDataPreviewRows` length > 0 → data card; else fall through to file card.
3. `text/html` with url or content → full-width HTML preview card (no iframe title / mediumID as visible text); CTA opens existing href/blob/`_onClick` modal path.
4. File path → DocumentCard with badge from `getDocumentBadgeLabel(mime, title, url)`, meta line, colored badge icon.

Strip debug: do not set visible `title` attribute to internal ids; use display filename only.

- [ ] **Step 4: CSS for caption, data rows, html preview full width (`grid-column: 1 / -1` when inside grid)**

- [ ] **Step 5: Tests PASS + commit**

```bash
git commit -m "feat(media): differentiate image, data, file, and HTML preview cards"
```

---

### Task 4: ChatBubble user attachment strip

**Files:**
- Modify: `src/components/ChatBubble/ChatBubble.tsx`
- Modify: `src/components/ChatBubble/ChatBubble.css`
- Test: `src/components/ChatBubble/ChatBubble.test.tsx`

**Interfaces:**
- When `message.fromUser` and `(topMediaWidgetMedia.length || topMediaWidgetLinks.length)`:
  - Render MediaWidget inside `.memori-chat--user-block` > `.memori-chat--attachment-strip`
  - Bubble remains sibling under `.memori-chat--user-block`
- Agent: keep MediaWidget above message row as today (or left of shell — current behavior)

- [ ] **Step 1: Failing test** — user message with media has `.memori-chat--attachment-strip` containing media items; strip is inside user block with bubble.

- [ ] **Step 2: Implement layout**

```tsx
{message.fromUser ? (
  <div className="memori-chat--bubble-message-row">
    <div className="memori-chat--user-block">
      {(topMediaWidgetMedia.length > 0 || topMediaWidgetLinks.length > 0) && (
        <div className="memori-chat--attachment-strip">
          <MediaWidget ... fromUser />
        </div>
      )}
      <div className="memori-chat--bubble-shell ...">...</div>
    </div>
    {renderUserAvatar()}
  </div>
) : (
  <>
    <MediaWidget ... /> {/* existing top media */}
    <div className="memori-chat--bubble-message-row">...</div>
  </>
)}
```

CSS:

```css
.memori-chat--user-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--memori-spacing-sm);
  max-width: min(70%, 42rem); /* match bubble-shell--from-user */
  min-width: 0;
  width: 100%;
}

.memori-chat--attachment-strip {
  width: 100%;
  padding: var(--memori-spacing-sm);
  border: 1px solid color-mix(in oklch, var(--memori-border-color) 80%, transparent);
  border-radius: var(--memori-radius-box);
  border-top-right-radius: 4px;
  background: color-mix(in oklch, var(--memori-main-background) 12%, transparent);
}

.memori-chat--attachment-strip .memori-media-items--grid.memori-media-items--user {
  max-width: 100%;
  margin-inline: 0;
}
```

Ensure user bubble shell max-width does not double-constrain oddly (shell may inherit from user-block).

- [ ] **Step 3: Tests + snapshots update + commit**

```bash
git commit -m "feat(chat): group user attachments with message bubble strip"
```

---

### Task 5: Verification

- [ ] Run focused tests: MediaItemWidget utils, DocumentCard, MediaItemWidget, ChatBubble
- [ ] Run `yarn stylelint` on touched CSS if needed
- [ ] Manual check against mockup intent (grouping, badges, card types)
- [ ] Final commit only if leftover polish

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Group user attachments with bubble | 4 |
| Correct extension badges | 1, 3 |
| Image + caption | 3 |
| Data MIME preview | 1, 3 |
| File icon + meta | 2, 3 |
| HTML Open preview, no debug leak | 3 |
| Width consistency / tokens | 4 |
| No upload/state changes | all |
