import React from 'react';
import type { VersionInfo } from '../types';
import { ctv_platforms, ctv_variants } from '../constants/platforms';
import { getPlatformQueryString } from '../utils/urlBuilder';
import { StatusMessage } from './StatusMessage';

interface InfoPanelProps {
  version?: VersionInfo;
  versionError?: string | null;
  app?: string;
  platform?: string;
  variant?: string;
  use?: string;
  purpose?: string;
  destination?: string;
  format?: string;
  isDeeplinksEnabled?: boolean;
  deeplinkPath?: string;
}

const Fact: React.FC<{ label: string; children: React.ReactNode; mono?: boolean }> = ({
  label,
  children,
  mono
}) => (
  <div className="min-w-0 leading-snug">
    <span className="text-[var(--text-muted)]">{label}:</span>{' '}
    <span className={mono ? 'font-mono text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}>
      {children}
    </span>
  </div>
);

export const InfoPanel: React.FC<InfoPanelProps> = ({
  version,
  versionError,
  app,
  platform,
  variant = '',
  use,
  purpose,
  destination,
  format,
  isDeeplinksEnabled = false,
  deeplinkPath
}) => {
  const platformInfo =
    app && platform ? ctv_platforms.find((entry) => entry.id === platform) : null;
  const variantInfo = platform
    ? ctv_variants.find(
        (entry) => entry.platforms.includes(platform) && entry.value === variant
      )
    : null;
  const queryParams = getPlatformQueryString(platform, variant);

  const siteFacts: React.ReactNode[] = [];
  const detailFacts: React.ReactNode[] = [];

  if (purpose) {
    siteFacts.push(
      <Fact key="purpose" label="Purpose">
        <span className="text-[var(--accent)]">{purpose}</span>
      </Fact>
    );
  }

  if (use) {
    siteFacts.push(
      <Fact key="use" label="Use">
        <span className="text-[var(--section-b)]">{use}</span>
      </Fact>
    );
  }

  if (version) {
    siteFacts.push(
      <Fact key="version" label="Version" mono>
        <span className="text-[var(--success)] font-semibold">{version.version}</span>
        {version.isMock ? (
          <span className="text-[var(--text-muted)]"> · placeholder</span>
        ) : null}
      </Fact>
    );
    if (version.hash) {
      siteFacts.push(
        <Fact key="hash" label="Hash" mono>
          {version.hash}
        </Fact>
      );
    }
    if (version.branch) {
      siteFacts.push(
        <Fact key="branch" label="Branch" mono>
          <span className="break-all">{version.branch}</span>
        </Fact>
      );
    }
  }

  if (versionError) {
    siteFacts.push(
      <StatusMessage
        key="version-error"
        tone={version?.isMock ? 'warning' : 'error'}
      >
        {versionError}
      </StatusMessage>
    );
  }

  const usageFact = platformInfo?.queryParamsUse ? (
    <Fact key="usage" label="Usage">
      {platformInfo.queryParamsUse}
    </Fact>
  ) : null;

  const variantFact = variantInfo ? (
    <Fact key="variant" label="Variant">
      <span className="text-[var(--section-b)]">{variantInfo.name}</span>
      {variantInfo.description ? (
        <span className="text-[var(--text-secondary)]"> — {variantInfo.description}</span>
      ) : null}
    </Fact>
  ) : null;

  if (isDeeplinksEnabled) {
    // Left: host + platform usage/variant
    if (usageFact) siteFacts.push(usageFact);
    if (variantFact) siteFacts.push(variantFact);

    // Right: deeplink facts, with query as the 4th line under Path
    if (destination) {
      detailFacts.push(
        <Fact key="destination" label="Destination">
          <span className="text-[var(--accent)]">{destination}</span>
        </Fact>
      );
    }
    if (format) {
      detailFacts.push(
        <Fact key="format" label="Format" mono>
          <span className="text-[var(--accent)]">{format}</span>
        </Fact>
      );
    }
    if (deeplinkPath) {
      detailFacts.push(
        <Fact key="path" label="Path" mono>
          /{deeplinkPath}
        </Fact>
      );
    }
    if (queryParams) {
      detailFacts.push(
        <Fact key="query" label="Query" mono>
          <span className="text-[var(--accent)]">{queryParams}</span>
        </Fact>
      );
    }
  } else {
    if (usageFact) detailFacts.push(usageFact);
    if (variantFact) detailFacts.push(variantFact);
  }

  const hasFacts = siteFacts.length > 0 || detailFacts.length > 0;
  const useTwoColumns = siteFacts.length > 0 && detailFacts.length > 0;

  return (
    <div className="detail-panel-slot">
      <div className="detail-panel-body min-w-0">
        {useTwoColumns ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
            <div className="space-y-1.5 min-w-0">{siteFacts}</div>
            <div className="space-y-1.5 min-w-0">{detailFacts}</div>
          </div>
        ) : hasFacts ? (
          <div className="space-y-1.5 min-w-0">
            {siteFacts}
            {detailFacts}
          </div>
        ) : (
          <p className="text-[length:var(--font-size-meta)] text-[var(--text-muted)] leading-snug">
            Purpose, use, and platform details show up here as you build the URL.
          </p>
        )}
      </div>
    </div>
  );
};
