import React from 'react';
import '../App.css';
import Component from '@/component/index';
import Lint from './lint/index';
function Page() {
  // const a = 'ds';
  return (
    <div className="demo">
      <Component />
      <Lint />
    </div>
  );
}

export default Page;
