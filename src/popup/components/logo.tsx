import React from "react";
import type { Props as ReactSVGProps } from "react-svg";
import { ReactSVG } from "react-svg";

import src from "../../icons/icon.svg";

export type Props = Omit<ReactSVGProps, "ref">;

function Logo(props: Props) {
  return <ReactSVG {...props} src={src} />;
}

export default Logo;
