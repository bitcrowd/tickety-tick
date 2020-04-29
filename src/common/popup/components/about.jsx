import Octicon, { ChevronLeft } from '@githubprimer/octicons-react';
import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../icons/icon-32.png';
import Content from './content';
import ExternalLink from './external-link';
import Navbar from './navbar';

const repo = 'https://github.com/bitcrowd/tickety-tick';
const tree = [repo, 'tree', COMMITHASH].join('/');

function About() {
  return (
    <>
      <Navbar>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <Octicon
                icon={ChevronLeft}
                width={7}
                height={14}
                className="mr-1"
              />
              Back
            </Link>
          </li>
        </ul>
      </Navbar>
      <Content>
        <h1 className="d-flex align-items-center h3 mb-3">
          {/* eslint-disable-next-line prettier/prettier */}
          <img src={logo} className="logo mr-1" alt="" />
          {' '}
          Tickety-Tick
        </h1>
        <h6>Usage:</h6>
        <ol className="pl-3">
          <li>Open a ticket in your favourite issue tracking system.</li>
          <li>Click the extension icon.</li>
          <li>
            Use the buttons to create a commit message, branch name or CLI
            command.
          </li>
        </ol>
        <p>
          {/* eslint-disable-next-line prettier/prettier */}
          This extension is open-source software by the fellows at
          {' '}
          {/* eslint-disable-next-line prettier/prettier */}
          <ExternalLink href="http://bitcrowd.net">bitcrowd</ExternalLink>
          .
        </p>
        <p>
          {/* eslint-disable-next-line prettier/prettier */}
          The source code is available on
          {' '}
          {/* eslint-disable-next-line prettier/prettier */}
          <ExternalLink href={repo}>GitHub</ExternalLink>
          .
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

About.propTypes = {};

export default About;
