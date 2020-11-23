import { JSDOM } from 'jsdom';

import loc from './__helpers__/location';
import scan from './tara';

const FULL_PAGE_VIEW = `
  <div>
    <div class="css-1xylvuj">
      <span class="css-1s8rsnh" data-cy="task-modal-task-id-text">TASK-17</span>
    </div>
    <div class="css-1mjsdq1">
      <textarea class="css-1jarjsr" data-cy="task-modal-task-name-text">This is a Tara task</textarea>
    </div>
    <div class="DraftEditor-root">
      <div class="DraftEditor-editorContainer">
          <div class="public-DraftEditor-content" role="textbox" contenteditable="true">
            <span data-text="true">Some description</span>
            <span data-text="true">That gets longer.</span>
          </div>
      </div>
    </div>
  </div>
`;

const MODAL_VIEW = `
  <div>
    <div>
      <div class="css-hqnyzv">
        <input data-cy="requirement-detail-name-input" class="css-1himjug" id="69704d00-2a80-11eb-a458-19b35bed1bcc" type="text" value="Tickety-Tick Demo">
      </div>
      <div class="DraftEditor-root">
        <div class="DraftEditor-editorContainer">
          <div class="public-DraftEditor-content" role="textbox" contenteditable="true">
            <div data-contents="true">
              <span data-text="true">There is some board description here.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="css-1cbh0vm"><input data-cy="requirement-detail-name-input" class="css-1himjug" id="69704d00-2a80-11eb-a458-19b35bed1bcc" type="text" value="Tickety-Tick Demo"></div>
      <div class="css-1xylvuj">
        <span class="css-1s8rsnh" data-cy="task-modal-task-id-text">TASK-123</span>
      </div>
      <div class="css-1mjsdq1">
        <textarea class="css-1jarjsr" data-cy="task-modal-task-name-text">This is a Tara task in modal view</textarea>
      </div>
      <div class="DraftEditor-root">
        <div class="DraftEditor-editorContainer">
            <div class="public-DraftEditor-content" role="textbox" contenteditable="true">
              <span data-text="true">Here goes some fancy description.</span>
              <span data-text="true">With multiple lines.</span>
            </div>
        </div>
      </div>
    </div>
  </div>
`;

describe('tara adapter', () => {
  function dom(body = '') {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it('returns an empty array if it is on a different page', async () => {
    const location = loc('some-other-website.com');
    const result = await scan(location, dom());

    expect(result).toEqual([]);
  });

  it('extracts tickets from full-page task view', async () => {
    const location = loc('app.tara.ai', '/my-workspace/tasks/17');
    const result = await scan(location, dom(FULL_PAGE_VIEW));

    expect(result).toEqual([
      {
        id: 'TASK-17',
        title: 'This is a Tara task',
        type: 'feature',
        description: 'Some description\nThat gets longer.',
        url: 'https://app.tara.ai/my-workspace/tasks/17',
      },
    ]);
  });

  it('extracts tickets from modal-overlay task view', async () => {
    const location = loc('app.tara.ai', '/my-workspace/tasks/123');
    const result = await scan(location, dom(MODAL_VIEW));

    expect(result).toEqual([
      {
        id: 'TASK-123',
        title: 'This is a Tara task in modal view',
        type: 'feature',
        description: 'Here goes some fancy description.\nWith multiple lines.',
        url: 'https://app.tara.ai/my-workspace/tasks/123',
      },
    ]);
  });
});
