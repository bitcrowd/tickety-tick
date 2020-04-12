import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../icons/icon-32.png';
import ExternalLink from './external-link';

const repo = 'https://github.com/bitcrowd/tickety-tick';
const tree = [repo, 'tree', COMMITHASH].join('/');

function About() {
  return (
    <div>
      <div className="navbar navbar-light fixed-top bg-white border-bottom">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              &lt; back
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <div className="container">
          <h1 className="h3 mt-3 mb-3">
            {/* eslint-disable-next-line prettier/prettier */}
            <img src={logo} className="logo-sm" alt="" />
            {' '}
            tickety-tick
          </h1>
          <h6>Usage:</h6>
          <ol className="mt-2 pl-3">
            <li>
              Open one or more tickets in your favourite ticket tracking system,
              then click the extension icon.
            </li>
            <li>
              You can then select if you want to create a commit message or a
              branch name based on these tickets.
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
            <ExternalLink
              href={tree}
              title="Browse source code for this version"
            >
              {COMMITHASH}
            </ExternalLink>
          </p>
          <p className="small">
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
        </div>
      </div>
    </div>
  );
}

About.propTypes = {};

export default About;
