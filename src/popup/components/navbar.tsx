import React from "react";

export type Props = { children: React.ReactNode };

function Navbar({ children }: Props) {
  return (
    <div className="navbar navbar-expand navbar-light border-bottom">
      {children}
    </div>
  );
}

export default Navbar;
