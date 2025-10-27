import { ChevronLeftIcon } from "@primer/octicons-react";
import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Logo } from "../../icons/icon.svg";
import Content from "./content";
import ExternalLink from "./external-link";
import Navbar from "./navbar";

const repo = "https://github.com/bitcrowd/tickety-tick";
const tree = [repo, "tree", COMMITHASH].join("/");

export type Props = Record<string, never>;

interface AboutProps {}

function About(_: AboutProps): React.ReactNode {
  return (
    <>
      <Navbar>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link ps-0" to="/">
              <ChevronLeftIcon size={14} className="octicon-nav" />
              Back
            </Link>
          </li>
        </ul>
      </Navbar>
      <Content>
        <h1 className="d-flex align-items-center h3 mb-3">
          <Logo className="logo me-1" /> Tickety-Tick
        </h1>
        <h6>Usage:</h6>
        <ol className="ps-3">
          <li>Open a ticket in your favourite issue tracking system.</li>
          <li>Click the extension icon.</li>
          <li>
            Use the buttons to create a commit message, branch name or CLI
            command.
          </li>
        </ol>
        <p>
          This extension is open-source software by the fellows at{" "}
          <ExternalLink href="http://bitcrowd.net">bitcrowd</ExternalLink>.
        </p>
        <p>
          The source code is available on{" "}
          <ExternalLink href={repo}>GitHub</ExternalLink>.
        </p>
        <p className="small">
          <ExternalLink href={tree} title="Browse source code for this version">
            {COMMITHASH}
          </ExternalLink>
        </p>
        <p className="small mb-0">
          <span>Logo by </span>
          <ExternalLink href="http://thenounproject.com/term/ticket/92194/">
            Ramón G.
          </ExternalLink>
          <span> under CC-BY&nbsp;3.0</span>
          <br />
          <span>Other icons from </span>
          <ExternalLink href="https://octicons.github.com/">
            GitHub Octicons
          </ExternalLink>
        </p>
      </Content>
    </>
  );
}

export default About;
