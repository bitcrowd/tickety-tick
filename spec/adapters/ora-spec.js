import { JSDOM } from 'jsdom';

import adapter from '../../src/common/adapters/ora';

function task({ id, title, type }) {
  return `
    <div class="single-task-modal" id="task-modal">
      <div class="sub-stats-container">
        <!-- … -->
      </div>
      <div class="header">
        <form data-ng-submit="updateTaskTitle(currentTask,taskTitle)">
          <textarea id="task-title">${title}</textarea>
        </form>
      </div>
      <div class="under-title-container">
        <div data-ng-hide="::!editRights" class="submenu">
          <div data-ng-if="features.visible_id" class="task-id">
            <span>#${id}</span>
          </div>
          <div data-ng-if="features['task_types']" data-is-open="taskTypesPopover.open">
            <div class="text dropdown-toggle" aria-expanded="false">
              <span class="hide-mobile capitalize-first-letter truncate70">${type}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="extras">
          <div>
            <div data-ng-if="description && !taskDescriptionEdit">
              <p>A description paragraph</p>
              <ul>
                <li>list item 0</li>
                <li>list item 1 with a mention <a data-uib-tooltip="Search for Regulations" class="mention">#42</a>)</li>
                <li>list item 2</li>
              </ul>
              <p>…and more text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

describe('ora adapter', () => {
  const loc = { host: 'ora.pm', pathname: '/project/53123/kanban/task/641617' };

  function doc(body) {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it('returns null if it is on a different page', () => {
    adapter.inspect({ host: 'github.com' }, null, (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(null);
    });
  });

  it('extracts feature tickets', () => {
    const ticket = { id: 'ORA12', title: 'Random Ora task title', type: 'feature' };
    adapter.inspect(loc, doc(task(ticket)), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual([ticket]);
    });
  });

  it('extracts chore tickets', () => {
    const ticket = { id: 'ORA12', title: 'Random Ora task title', type: 'chore' };
    adapter.inspect(loc, doc(task(ticket)), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual([ticket]);
    });
  });

  it('extracts bug tickets', () => {
    const ticket = { id: 'ORA12', title: 'Random Ora task title', type: 'bug' };
    adapter.inspect(loc, doc(task(ticket)), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual([ticket]);
    });
  });
});
