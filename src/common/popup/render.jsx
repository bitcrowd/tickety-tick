import React from 'react';
import ReactDOM from 'react-dom';

import Tool from './components/tool';
import EnvContext from './env-context';

function render(tickets, errors, env) {
  const root = document.getElementById('popup-root');

  const element = (
    <EnvContext.Provider value={env}>
      <Tool tickets={tickets} errors={errors} />
    </EnvContext.Provider>
  );

  ReactDOM.render(element, root);
}

export default render;
