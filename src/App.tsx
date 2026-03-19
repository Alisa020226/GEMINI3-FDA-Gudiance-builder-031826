/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DocIngestion } from './components/DocIngestion';
import { GuidanceGenerator } from './components/GuidanceGenerator';
import { MarkdownEditor } from './components/MarkdownEditor';
import { SubmissionTriage, ReviewReport } from './components/Placeholders';
import { Settings } from './components/Settings';
import { TelemetryTerminal } from './components/TelemetryTerminal';

export default function App() {
  const [activeTab, setActiveTab] = useState('ingestion');

  const renderContent = () => {
    switch (activeTab) {
      case 'ingestion':
        return <DocIngestion />;
      case 'generator':
        return <GuidanceGenerator />;
      case 'editor':
        return <MarkdownEditor />;
      case 'triage':
        return <SubmissionTriage />;
      case 'report':
        return <ReviewReport />;
      case 'settings':
        return <Settings />;
      case 'terminal':
        return <TelemetryTerminal />;
      default:
        return <DocIngestion />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
