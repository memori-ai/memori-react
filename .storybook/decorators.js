import React from 'react';
import I18nWrapper from '../src/I18nWrapper';
import { VisemeProvider } from '../src/context/visemeContext';
import { ArtifactProvider } from '../src/components/MemoriArtifactSystem/context/ArtifactContext';

/**
 * Shared providers for full-widget / layout stories (i18n + artifact + viseme).
 * Prefer this over copying the triple-wrap in every Template.
 *
 * @type {import('@storybook/react').Decorator}
 */
export const withWidgetProviders = Story =>
  React.createElement(
    I18nWrapper,
    null,
    React.createElement(
      ArtifactProvider,
      null,
      React.createElement(VisemeProvider, null, React.createElement(Story))
    )
  );

/**
 * i18n only — for leaf compositions that do not need Artifact/Viseme.
 * @type {import('@storybook/react').Decorator}
 */
export const withI18n = Story =>
  React.createElement(I18nWrapper, null, React.createElement(Story));
