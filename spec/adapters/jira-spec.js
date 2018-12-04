import { JSDOM } from 'jsdom';

import adapter from '../../src/common/adapters/jira';

describe('old layout', () => {
  // parts of the dom of the jira backlog issue-list
  // contains two tickets - one of them being selected
  const BACKLOG = `
    <div class="ghx-backlog-column">
      <div class="ghx-backlog-card ghx-selected">
        <div class="ghx-issue-content">
          <div class="ghx-row ghx-plan-main-fields">
            <span class="ghx-backlog-card-expander-spacer"></span>
            <span class="ghx-type items-spacer" title="Story">
              <img src="https://someorg.atlassian.net/secure/viewavatar?size=xsmall&amp;avatarId=12345&amp;avatarType=issuetype">
            </span>
            <div class="ghx-summary" data-tooltip="A Random JIRA Backlog Issue">
              <span class="ghx-inner">A Random JIRA Backlog Issue</span>
            </div>
          </div>
          <div class="ghx-row ghx-end ghx-items-container">
            <span class="aui-lozenge ghx-label ghx-label-single ghx-label-3" title="Chores" data-epickey="UXPL-123">
              Chores
            </span>
            <span class="ghx-end ghx-items-container">
              <a href="/browse/UXPL-39" title="UXPL-39" class="ghx-key js-key-link">
                UXPL-39
              </a>
              <span class="ghx-priority" title="Medium">
                <img src="https://someorg.atlassian.net/images/icons/priorities/medium.svg">
              </span>
              <span class="aui-badge ghx-spacer ghx-statistic-badge"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="ghx-backlog-card">
        <div class="ghx-issue-content">
          <div class="ghx-row ghx-plan-main-fields">
            <span class="ghx-backlog-card-expander-spacer"></span>
            <span class="ghx-type items-spacer" title="Bug">
              <img src="https://someorg.atlassian.net/secure/viewavatar?size=xsmall&amp;avatarId=12345&amp;avatarType=issuetype">
            </span>
            <div class="ghx-summary" data-tooltip="A Random JIRA Bug Issue">
              <span class="ghx-inner">A Random JIRA Bug Issue</span>
            </div>
          </div>
          <div class="ghx-row ghx-end ghx-items-container">
            <span class="aui-lozenge ghx-label ghx-label-single ghx-label-3" title="Chores" data-epickey="UXPL-123">
              Chores
            </span>
            <span class="ghx-end ghx-items-container">
              <a href="/browse/UXPL-47" title="UXPL-47" class="ghx-key js-key-link">
                UXPL-47
              </a>
              <span class="ghx-priority" title="Low">
                <img src="https://someorg.atlassian.net/images/icons/priorities/low.svg">
              </span>
              <span class="aui-badge ghx-spacer ghx-statistic-badge"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
  const BUG_BACKLOG = BACKLOG.replace(/Story/, 'Bug');
  const CHORE_BACKLOG = BACKLOG.replace(/Story/, 'Chore');
  const BACKLOG_TWO_TICKETS_SELECTED = BACKLOG.replace('<div class="ghx-backlog-card">', '<div class="ghx-backlog-card ghx-selected">');

  const STORYPAGE = `
    <div id="issue-content">
      <div class="issue-header-content">
        <a class="issue-link" data-issue-key="UXPL-39" id="key-val">UXPL-39</a>
        <h1 id="summary-val">A Random JIRA Issue</h1>
      </div>
      <div class="issue-body-content">
        <span id="type-val" class="value editable-field inactive">
          <img alt="" src="/" title="Story - A story"> Story
        </span>
      </div>
    </div>
  `;

  const STORYPAGE_TITLE_EDITED = `
    <div id="issue-content">
      <div class="issue-header-content">
        <a class="issue-link" data-issue-key="UXPL-39" id="key-val">UXPL-39</a>
        <h1 id="summary-val" class="editable-field active">
          <form id="summary-form">
            <textarea id="summary">A Random JIRA Issue</textarea>
            <button type="submit">Save</button>
              <button type="cancel">Cancel</button>
          </form>
        </h1>
      </div>
      <div class="issue-body-content">
        <span id="type-val" class="value editable-field inactive">
          <img alt="" src="/" title="Story - A story"> Story
        </span>
      </div>
    </div>
  `;

  const CHOREPAGE = STORYPAGE.replace(/Story/gi, 'Chore');
  const BUGPAGE = STORYPAGE.replace(/Story/gi, 'Bug');

  const BOARD_STORY = `
  <div class="ghx-columns">
    <div class="ghx-column">
      <div class="ghx-issue ghx-selected">
        <section class="ghx-summary" title="">A Random JIRA Board Issue</section>
        <section class="ghx-extra-fields">
          <div class="ghx-row"><span class="ghx-extra-field ghx-fa"><span class="ghx-extra-field-content">None</span></span></div>
        </section>
        <section class="ghx-stat-fields">
          <div class="ghx-row ghx-stat-1">
            <span class="ghx-field ghx-field-icon" data-tooltip="Story"><img src=""></span>
            <span class="ghx-field ghx-field-icon" data-tooltip="Some other thing"><img src=""></span>
            <span class="ghx-field"></span><span class="ghx-field"><img src="" class="ghx-avatar-img"></span></div>
        <div class="ghx-row ghx-stat-2">
            <span class="ghx-field"><img src="" class="ghx-avatar-img"></span>
            <a href="/browse/UXPL-39" aria-label="UXPL-39" data-tooltip="UXPL-39" tabindex="-1" class="ghx-key">
              <span class="ghx-issuekey-pkey js-key-link" aria-hidden="true">UXPL</span>
              <span class="ghx-issuekey-number js-key-link" aria-hidden="true">39-</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
  `;

  const BOARD_CHORE = BOARD_STORY.replace(/Story/gi, 'Chore');
  const BOARD_BUG = BOARD_STORY.replace(/Story/gi, 'Bug');

  describe('jira adapter', () => {
    function doc(body = '', id = 'jira') {
      const { window } = new JSDOM(`<html><body id="${id}">${body}</body></html>`);
      return window.document;
    }

    it('returns null if it is on a different page', () => {
      adapter.inspect(null, doc(STORYPAGE, 'foo'), (err, res) => {
        expect(err).toBe(null);
        expect(res).toBe(null);
      });
    });

    it('extracts story tickets from a ticket page', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'feature' }];
      adapter.inspect(null, doc(STORYPAGE), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts story tickets from a ticket page even when the title is being edited', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'feature' }];
      adapter.inspect(null, doc(STORYPAGE_TITLE_EDITED), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts bug tickets from a ticket page', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'bug' }];
      adapter.inspect(null, doc(BUGPAGE), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts chore tickets from a ticket page', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'chore' }];
      adapter.inspect(null, doc(CHOREPAGE), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts tickets from the backlog', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Backlog Issue', type: 'feature' }];
      adapter.inspect(null, doc(BACKLOG), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts bug tickets from the backlog', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Backlog Issue', type: 'bug' }];
      adapter.inspect(null, doc(BUG_BACKLOG), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts chore tickets from the backlog', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Backlog Issue', type: 'chore' }];
      adapter.inspect(null, doc(CHORE_BACKLOG), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts tickets from the backlog when multiple tickets are selected', () => {
      const expected = [
        { id: 'UXPL-39', title: 'A Random JIRA Backlog Issue', type: 'feature' },
        { id: 'UXPL-47', title: 'A Random JIRA Bug Issue', type: 'bug' },
      ];
      adapter.inspect(null, doc(BACKLOG_TWO_TICKETS_SELECTED), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts selected tickets from the board', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'feature' }];
      adapter.inspect(null, doc(BOARD_STORY), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts selected bug tickets from the board', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'bug' }];
      adapter.inspect(null, doc(BOARD_BUG), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts selected chore tickets from the board', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'chore' }];
      adapter.inspect(null, doc(BOARD_CHORE), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });
  });
});

/*
  New layout
 */
describe('new layout', () => {
  // parts of the dom of the jira backlog issue-list
  // contains two tickets - one of them being selected
  const BACKLOG = `
    <div class="sc-Kgodr jEpXyB">
       <div class="sc-gDPesD dBkrpX">
          <div class="sc-dsaGNW fDKNkO" role="button" tabindex="0" aria-expanded="true">
             <div class="sc-efAmGo gMWlCu">
                <span class="sc-csuQGl bmmkRb">
                   <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
                      <path d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z" fill="currentColor" fill-rule="evenodd"></path>
                   </svg>
                </span>
             </div>
             <div class="sc-dqvjwr bDWSSY">Backlog</div>
             <div class="sc-euofZA gPDAwt">3 issues</div>
          </div>
          <div class="sc-hmAwuO buIBmc">
             <div><span class="sc-NOpvV gjkMWt"><span class="sc-dzVpKk honVeG">3</span></span><span class="sc-NOpvV gjkMWt"><span class="sc-dzVpKk brakKE">0</span></span><span class="sc-NOpvV gjkMWt"><span class="sc-dzVpKk gMeCNj">0</span></span></div>
          </div>
          <div class="sc-hmAwuO buIBmc"><button class="sc-EHOje hyJTmD" spacing="default" type="button"><span><span>Create sprint</span></span></button></div>
       </div>
       <div class="sc-guUSXb PaUQl">
          <div data-react-beautiful-dnd-droppable="2">
             <div>
                <div class="sc-eOnLuU XXzdQ" data-react-beautiful-dnd-draggable="2" tabindex="0" data-react-beautiful-dnd-drag-handle="2" aria-roledescription="Draggable item. Press space bar to lift" draggable="false">
                   <div class="sc-fMvjmP dVeVUp"><img class="sc-gOhbcK jakkJm" role="presentation" src="/secure/viewavatar?size=xsmall&amp;avatarId=10315&amp;avatarType=issuetype"></div>
                   <div class="sc-igaqVs ioXeXy">
                      <div>
                         <div class="sc-bXVTRF coaBE">A Random JIRA Backlog Issue</div>
                      </div>
                   </div>
                   <a class="sc-gcpVEs eofwL" href="/browse/UXPL-39" tabindex="-1">UXPL-39</a>
                   <div class="sc-eylKsO bqlpkB"></div>
                </div>
             </div>
             <div>
                <div class="sc-eOnLuU cPUuvS" data-react-beautiful-dnd-draggable="2" tabindex="0" data-react-beautiful-dnd-drag-handle="2" aria-roledescription="Draggable item. Press space bar to lift" draggable="false">
                   <div class="sc-fMvjmP dVeVUp"><img class="sc-gOhbcK jakkJm" role="presentation" src="/secure/viewavatar?size=xsmall&amp;avatarId=10315&amp;avatarType=issuetype"></div>
                   <div class="sc-igaqVs ioXeXy">
                      <div>
                         <div class="sc-bXVTRF coaBE">Another Random JIRA Issue</div>
                      </div>
                   </div>
                   <a class="sc-gcpVEs eofwL" href="/browse/UXPL-47" tabindex="-1">UXPL-47</a>
                   <div class="sc-eylKsO bqlpkB"></div>
                </div>
             </div>
          </div>
          <div class="sc-hBAMER kFCrqp">
             <button class="sc-iipuKH ckwscm">
                <span class="sc-bPzAnn fMqaHi">
                   <span class="sc-csuQGl juTkzQ" aria-label="Create issue">
                      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
                         <path d="M13 11V7a1 1 0 0 0-2 0v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4z" fill="currentColor" fill-rule="evenodd"></path>
                      </svg>
                   </span>
                </span>
                Create issue
             </button>
          </div>
       </div>
    </div>
  `;

  const STORYPAGE = `
  <div>
    <div>
      <a href="/browse/UXPL-39"><span>UXPL-39</span></a>
    </div>
    <div>
      <h1>A Random JIRA Board Issue</h1>
      <div>
        A referenced issue on the same issue page
        <a href="/browse/UXPL-47"><span>UXPL-47</span></a>
      </div>
    </div>
  </div>
  `;

  const BOARD_STORY = `
  <div role="dialog">
    <a href="/browse/UXPL-39"><span>UXPL-39</span></a>
    <h1>A Random JIRA Board Issue</h1>
  </div>
  `;

  describe('jira adapter', () => {
    function doc(body = '', id = 'jira') {
      const { window } = new JSDOM(`<html><body id="${id}">${body}</body></html>`);
      return window.document;
    }

    it('returns null if it is on a different page', () => {
      adapter.inspect('/browse/UXPL-39', doc(STORYPAGE, 'foo'), (err, res) => {
        expect(err).toBe(null);
        expect(res).toBe(null);
      });
    });

    it('extracts story tickets from a ticket page', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'feature' }];
      adapter.inspect('/browse/UXPL-39', doc(STORYPAGE), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts tickets from the backlog', () => {
      const expected = [
        { id: 'UXPL-39', title: 'A Random JIRA Backlog Issue', type: 'feature' },
        { id: 'UXPL-47', title: 'Another Random JIRA Issue', type: 'feature' },
      ];
      adapter.inspect('/RapidBoard.jspa?rapidView=3', doc(BACKLOG), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });

    it('extracts selected tickets from the board', () => {
      const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'feature' }];
      adapter.inspect('/RapidBoard.jspa?rapidView=6', doc(BOARD_STORY), (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(expected);
      });
    });
  });
});
