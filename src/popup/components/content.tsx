import React from "react";

export type Props = { children: React.ReactNode };

function Content({ children }: Props) {
  return <div className="container-fluid py-3">{children}</div>;
}

export default Content;
