/// <reference types="react" />

// Define type for ".svg" imports handled by "@svgr/webpack"
declare module "*.svg" {
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// Unfortunately there are no type definitions for "micro-match" at the moment
declare module "micro-match";

// This global const is defined by the Webpack DefinePlugin
declare const COMMITHASH: string;
