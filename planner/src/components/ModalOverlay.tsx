'use client';

export function ModalOverlay({
  onClose,
  maxWidth,
  children,
}: {
  onClose: () => void;
  maxWidth: number;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(60,42,28,0.32)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '44px 20px',
        overflowY: 'auto',
        zIndex: 50,
        animation: 'rwaOverlay var(--dur-fast) var(--ease-soft)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--surface-page)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'rwaFade var(--dur-base) var(--ease-soft)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
