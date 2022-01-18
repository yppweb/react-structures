import React, { lazy } from 'react';
import '../App.css';
// 懒加载 lazy需要与suspense一起使用
const Component = lazy(() => import('@/component/index'));
const Lint = lazy(() => import('./lint/index'));

function Page() {
  return (
    <div className="demo">
      <Component />
      <Lint />
    </div>
  );
}

export default Page;
