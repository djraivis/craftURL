import React from 'react';
import { Dices, Minimize2 } from 'lucide-react';
import { Header } from './components/Header';
import { UrlDisplay } from './components/UrlDisplay';
import { Configuration } from './components/Configuration';
import { siteAllowsPlatformQuery } from './constants/environments';
import { useBuilderState } from './hooks/useBuilderState';

function App() {
  const builder = useBuilderState();
  const includePlatformQuery = siteAllowsPlatformQuery(builder.name);

  return (
    <div
      className={`gradient-bg ${builder.isTunerMode ? 'is-tuner' : ''} ${
        builder.isRetuning ? 'is-retuning' : ''
      }`}
    >
      {builder.isTunerMode && (
        <div className="tuner-controls">
          <button
            type="button"
            className="tuner-retune-button"
            onClick={() => void builder.retune()}
            disabled={builder.isRetuning}
            title="Randomly retune Site, Environment, and Platform"
            aria-label="Retune"
          >
            <Dices size={16} aria-hidden />
            {builder.isRetuning ? 'Retuning…' : 'Retune'}
          </button>
          <button
            type="button"
            className="tuner-exit-button"
            onClick={builder.exitTunerMode}
            title="Exit Tuner mode (Esc)"
            aria-label="Exit Tuner mode"
          >
            <Minimize2 size={16} aria-hidden />
            Exit Tuner
          </button>
        </div>
      )}

      <div className={`url-sticky-nav ${builder.isTunerMode ? 'is-tuner' : ''}`}>
        <UrlDisplay
          app={builder.app}
          name={builder.name}
          environment={builder.environment}
          platform={includePlatformQuery ? builder.platform : undefined}
          variant={includePlatformQuery ? builder.variant : undefined}
          path={builder.path}
          previousValues={builder.previousValues.current}
          isDeeplinksEnabled={builder.isTunerMode ? false : builder.isDeeplinksEnabled}
          showLegend={builder.showUrlLegend || builder.isTunerMode}
          isTunerMode={builder.isTunerMode}
          retuningSegments={builder.retuningSegments}
          settlingSegments={builder.settlingSegments}
          environmentOptions={builder.environmentOptions}
          siteOptions={builder.siteOptions}
          platformOptions={builder.platformOptions}
          selectedEnvironmentId={builder.environmentType}
          selectedPlatformSpec={`${builder.platform}|||${builder.variant}`}
          onOpen={builder.openUrl}
          onCopy={builder.copyToClipboard}
          onTunerEnvironmentSelect={builder.handleTunerEnvironmentSelect}
          onTunerSiteSelect={builder.handleTunerSiteSelect}
          onTunerPlatformSelect={builder.handleTunerPlatformSpec}
        />
      </div>

      {!builder.isTunerMode && (
        <div className="app-panels">
          <div className="app-panels-inner space-y-[var(--space-stack)]">
            <Header
              urlReady={Boolean(builder.name && builder.environment)}
              onCopy={builder.copyToClipboard}
              onOpen={builder.openUrl}
              showUrlLegend={builder.showUrlLegend}
              onToggleUrlLegend={builder.toggleUrlLegend}
              onEnterTunerMode={builder.enterTunerMode}
            />

            <Configuration
              environmentType={builder.environmentType}
              name={builder.name}
              platform={builder.platform}
              variant={builder.variant}
              selectedDeeplink={builder.selectedDeeplink}
              onEnvironmentTypeSelect={builder.handleEnvironmentTypeSelect}
              onNameSelect={builder.handleNameSelect}
              onPlatformSelect={builder.handlePlatformSelect}
              onVariantSelect={builder.handleVariantSelect}
              onContentChange={builder.handleContentChange}
              onDeeplinkSelect={builder.handleDeeplinkSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
