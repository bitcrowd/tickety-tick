import React from 'react';
import { IndexLink } from 'react-router';

import ExternalLink from './external-link';

function About() {
  return (
    <div>
      <div className="container header">
        <IndexLink to="/">&lt; back</IndexLink>
      </div>
      <div className="content">
        <div className="container about">
          <div>
            <h1 className="about-heading">
              <img src="../icons/icon-16.png" role="presentation" /> tickety-tick
            </h1>
            <p>
              Open one ore more tickets in your favourite ticket tracking system,
              then click the extension icon.
            </p>
            <p>
              You can then select if you want to create a commit message or a branch name
              based on these tickets.
            </p>
            <p>
              <span>This extension is open-source software by your fellows at </span>
              <ExternalLink href="http://bitcrowd.net">bitcrowd</ExternalLink>.
            </p>
            <p>
              <span>The source code is available on </span>
              <ExternalLink href="https://github.com/bitcrowd/tickety-tick">GitHub</ExternalLink>.
            </p>
            <p>
              <span>Logo by </span>
              <ExternalLink href="http://thenounproject.com/term/ticket/92194/">
                Ramón G.
              </ExternalLink>
              <span> under CC-BY&nbsp;3.0</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

About.propTypes = {};

export default About;
