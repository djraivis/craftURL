import React from 'react';
import { deeplinkOptions } from '../constants/deeplinks';
import type { DeeplinkOption } from '../types';

interface DeeplinkPanelProps {
  selectedDeeplink: string;
  disabled?: boolean;
  onDeeplinkSelect: (deeplink: DeeplinkOption) => void;
}

export const DeeplinkPanel: React.FC<DeeplinkPanelProps> = ({
  selectedDeeplink,
  disabled = false,
  onDeeplinkSelect
}) => {
  const handleSelect = (option: DeeplinkOption) => {
    if (disabled) return;

    if (option.id === selectedDeeplink) {
      onDeeplinkSelect({
        id: '',
        name: '',
        url: '',
        destination: '',
        format: ''
      });
      return;
    }
    onDeeplinkSelect(option);
  };

  return (
    <div
      className={`grid grid-cols-2 gap-1 w-full min-w-0 ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
      aria-disabled={disabled}
    >
      {deeplinkOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => handleSelect(option)}
          disabled={disabled}
          aria-pressed={selectedDeeplink === option.id}
          className={`terminal-button justify-start text-left ${
            selectedDeeplink === option.id ? 'active' : ''
          }`}
          title={
            disabled
              ? 'Deeplinks are not available on this host'
              : [option.destination, option.format].filter(Boolean).join(' · ')
          }
        >
          <span className="truncate w-full font-medium">{option.name}</span>
        </button>
      ))}
    </div>
  );
};
