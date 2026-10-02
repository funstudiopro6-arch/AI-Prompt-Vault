import { useEffect, useId, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Modal({
  title,
  subtitle,
  children,
  onClose,
  className = '',
  wide = false,
}) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first =
      ref.current?.querySelector(
        'input:not([type="checkbox"]):not([type="file"]), textarea, select',
      ) || ref.current?.querySelector('button, a[href]');
    first?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key === 'Tab') {
        const focusable = [
          ...ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex="0"]',
          ),
        ].filter((item) => !item.disabled && item.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first || !ref.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || !ref.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKey);
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`modal ${wide ? 'modal-wide' : ''} ${className}`}
      >
        <header className="modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
