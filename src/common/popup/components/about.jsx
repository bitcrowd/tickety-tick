import React from 'react';
import { Link } from 'react-router-dom';

import ExternalLink from './external-link';

import logo from '../../icons/icon-32.png';

function About() {
  return (
    <div>
      <div className="navbar navbar-light fixed-top bg-white border-bottom">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">&lt; back</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <div className="container">
          <div>
            <h1 className="h3 mt-3 mb-3">
              <img
                src={logo}
                className="logo-sm"
                alt=""
              />
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
                You can then select if you want to create a commit message or a branch name
                based on these tickets.
              </li>
            </ol>
            <p>
              <span>This extension is open-source software by the fellows at </span>
              <ExternalLink href="http://bitcrowd.net">bitcrowd</ExternalLink>
              .
            </p>
            <p>
              <span>The source code is available on </span>
              <ExternalLink href="https://github.com/bitcrowd/tickety-tick">GitHub</ExternalLink>
              .
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
    </div>
  );
}

About.propTypes = {};

export default About;
