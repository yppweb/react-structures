import React, { Suspense } from 'react';
import './App.css';
import Page from './pages/index';

function App() {
  return (
    <Suspense fallback={<div>sdsfs</div>}>
      <div className="App">
        <Page />
      </div>
    </Suspense>
  );
}

export default App;
