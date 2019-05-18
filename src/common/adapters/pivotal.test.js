import { JSDOM } from 'jsdom';

import scan from './pivotal';

function selected({ id, title, type }) {
  return `
    <div class="story ${type}" data-id="${id}">
      <header class="preview">
        <a class="selector selected"></a>
        <span class="name">
          <span class="story_name">${title}</span>
        </span>
      </header>
    </div>
  `;
}

function opened({ id, title, type }) {
  return `
    <div class="story ${type}" data-id="${id}">
      <div class="details">
        <section class="edit">
          <form action="#" class="story">
            <fieldset class="story name">
              <textarea class="editor name" name="story[name]">${title}</textarea>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  `;
}

function maximized({ id, title, type }) {
  return `
    <article class="story ${type} maximized">
      <div class="details">
        <section class="edit">
          <form action="#" class="story">
            <fieldset class="story name">
              <textarea class="editor name" name="story[name]">${title}</textarea>
            </fieldset>
          </form>
          <aside>
            <div class="actions">
              <input type="text" class="id" value="#${id}">
            </div>
          </aside>
        </section>
      </div>
    </article>
  `;
}

describe('pivotal adapter', () => {
  function dom(body = '', id = 'tracker') {
    const { window } = new JSDOM(`<html><body id="${id}">${body}</body></html>`);
    return window.document;
  }

  it('returns an empty array if it is on a different page', async () => {
    const doc = dom(selected({ id: '1', title: 'Foo' }), 'trello');
    const result = await scan(null, doc);
    expect(result).toEqual([]);
  });

  it('extracts tickets from selected stories', async () => {
    const expected = [{ id: '1231244', title: 'A Selected Pivotal Story', type: 'feature' }];
    const doc = dom(expected.map(selected).join(''));
    const result = await scan(null, doc);
    expect(result).toEqual(expected);
  });

  it('extracts tickets from opened stories', async () => {
    const expected = [{ id: '1231245', title: 'An Opened Pivotal Story', type: 'bug' }];
    const doc = dom(expected.map(opened).join(''));
    const result = await scan(null, doc);
    expect(result).toEqual(expected);
  });

  it('extracts tickets from maximized stories', async () => {
    const expected = [{ id: '1231246', title: 'A Maximized Pivotal Story', type: 'chore' }];
    const doc = dom(expected.map(maximized).join(''));
    const result = await scan(null, doc);
    expect(result).toEqual(expected);
  });
});
