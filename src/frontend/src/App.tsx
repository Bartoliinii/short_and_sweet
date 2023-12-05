import React, { useState } from 'react';
import UrlInput from './UrlInput';
import ReviewFetcher from './ReviewFetcher';

const App: React.FC = () => {
  const [appId, setAppId] = useState<string>('');

  const handleUrlSubmitted = (appId: string) => {
    setAppId(appId);
  };

  return (
    <div>
      <h1>App Review Fetcher</h1>
      <UrlInput onUrlSubmitted={handleUrlSubmitted} />
      {appId && <ReviewFetcher appId={appId} />}
    </div>
  );
};

export default App;
