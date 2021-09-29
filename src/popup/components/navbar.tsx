import React from "react";

export type Props = { children: React.ReactNode };

function Navbar({ children }: Props) {
  return (
    <div className="navbar navbar-expand navbar-light bg-light border-bottom">
      <div className="container-fluid">{children}</div>
    </div>
  );
}

export default Navbar;
