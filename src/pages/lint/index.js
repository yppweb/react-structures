import React, { useEffect, useState } from 'react';
import '../../App.css';
// import { cube } from '../index';
let timer = null;

function Lint() {
  const [comp, setComp] = useState(null);
  useEffect(() => {
    timer = setTimeout(() => {
      // 动态导入
      import('@/component/index')
        .then(({ default: Comp }) => {
          setComp(Comp);
          // cube();
        });
    }, 3000);
    return () => {
      clearTimeout(timer);
      timer = null;
    };
  }, []);
  return (
    <div className="demo">
      <h4>lint</h4>
      {comp}
    </div>
  );
}

export default Lint;
