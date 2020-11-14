import { JSDOM } from 'jsdom';

import loc from './__helpers__/location';
import scan from './tara';

const TASK_PAGE = `
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

  it('extracts tickets from task pages', async () => {
    const location = loc('app.tara.ai', '/my-workspace/tasks/17');
    const result = await scan(location, dom(TASK_PAGE));

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
});
