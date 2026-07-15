import React from 'react';

type StatusTone = 'hint' | 'error' | 'warning';

interface StatusMessageProps {
  tone?: StatusTone;
  children: React.ReactNode;
  /** Announce to assistive tech (errors should usually live). */
  live?: 'polite' | 'assertive' | 'off';
  id?: string;
  className?: string;
}

const TONE_CLASS: Record<StatusTone, string> = {
  hint: 'status-message status-message-hint',
  error: 'status-message status-message-error',
  warning: 'status-message status-message-warning'
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  tone = 'hint',
  children,
  live = tone === 'error' ? 'assertive' : 'off',
  id,
  className = ''
}) => (
  <p
    id={id}
    role={tone === 'error' ? 'alert' : undefined}
    aria-live={live === 'off' ? undefined : live}
    className={`${TONE_CLASS[tone]} ${className}`.trim()}
  >
    {children}
  </p>
);
