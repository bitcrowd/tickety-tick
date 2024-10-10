import React from "react";

export type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function ExternalLink({ children, href, ...other }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...other}>
      {children}
    </a>
  );
}

export default ExternalLink;
