import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', 'iframe', '[tabindex]:not([tabindex="-1"])',
].join(',');

const focusablesIn = (node: HTMLElement) =>
  Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest('[inert],[aria-hidden="true"]'));

/**
 * LT-357 (from lightor-front, LT-346): what a popup owes keyboard and
 * screen-reader visitors. While `open`: focus moves into it (the first
 * control, else the box itself, which then needs tabIndex={-1}); Escape
 * closes it; with `trap`, Tab cycles inside it. On close, focus goes back to
 * whatever opened it.
 */
export function useDialogFocus(
  open: boolean,
  ref: RefObject<HTMLElement>,
  onClose: () => void,
  { trap = true }: { trap?: boolean } = {},
): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = ref.current;
    if (node && !node.contains(document.activeElement)) (focusablesIn(node)[0] ?? node).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (!trap || e.key !== 'Tab' || !ref.current) return;
      const els = focusablesIn(ref.current);
      if (!els.length) { e.preventDefault(); return; }
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !ref.current.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !ref.current.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener && opener.isConnected) opener.focus();
    };
  // `ref` is a stable ref object.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trap]);
}
