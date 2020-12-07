import { createContext } from 'react';

const EnvContext = createContext({ close: null, openopts: null, pbcopy: null });

export default EnvContext;
