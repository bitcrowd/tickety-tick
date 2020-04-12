import { shallow } from 'enzyme';
import React from 'react';

import format, { defaults as fallbacks, helpers } from '../../../common/format';
import CheckboxInput from './checkbox-input';
import Form from './form';
import TemplateInput from './template-input';

jest.mock('../../../common/format', () => {
  const mockFormat = jest.fn();
  const actual = jest.requireActual('../../../common/format');
  return Object.assign(mockFormat, actual);
});

describe('form', () => {
  function render(overrides, options = {}) {
    const defaults = {
      store: {
        get: jest.fn().mockResolvedValue({}),
        set: jest.fn().mockResolvedValue({}),
      },
    };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<Form {...props} />, options);

    return wrapper;
  }

  const inputs = (wrapper) => wrapper.find(TemplateInput);
  const input = (wrapper, name) => inputs(wrapper).filter({ name });
  const value = (wrapper, name) => input(wrapper, name).prop('value');

  const change = (wrapper, name, val) => {
    const event = { target: { name, value: val } };
    const field = input(wrapper, name);
    field.simulate('change', event);
  };

  const checkbox = (wrapper, name) =>
    wrapper.find(CheckboxInput).find({ name });
  const checked = (wrapper, name) => checkbox(wrapper, name).prop('checked');

  const toggle = (wrapper, name, check) => {
    const event = { target: { type: 'checkbox', name, checked: check } };
    const field = checkbox(wrapper, name);
    field.simulate('change', event);
  };

  beforeEach(() => {
    format.mockImplementation((templates, autofmt) => ({
      summary: () => `formatted-summary (${autofmt})`,
      commit: () => `formatted-commit (${autofmt})`,
      branch: () => `formatted-branch (${autofmt})`,
      command: () => `formatted-command (${autofmt})`,
    }));
  });

  afterEach(() => {
    format.mockReset();
  });

  it('renders a template-input for the branch name format', () => {
    const wrapper = render({});
    const instance = wrapper.instance();

    const field = input(wrapper, 'branch');

    expect(field.props()).toEqual({
      icon: expect.any(Object),
      label: 'Branch Name Format',
      id: 'branch-name-format',
      name: 'branch',
      value: '',
      multiline: false,
      fallback: fallbacks.branch,
      preview: expect.any(String),
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('renders a template-input for the commit message format', () => {
    const wrapper = render({});
    const instance = wrapper.instance();

    const field = input(wrapper, 'commit');

    expect(field.props()).toEqual({
      icon: expect.any(Object),
      label: 'Commit Message Format',
      id: 'commit-message-format',
      name: 'commit',
      value: '',
      multiline: true,
      fallback: fallbacks.commit,
      preview: expect.any(String),
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('conditionally pretty-prints the commit message', () => {
    const wrapper = render({});
    let field = input(wrapper, 'commit');

    expect(format).toHaveBeenCalledWith(expect.any(Object), true);
    expect(field.prop('preview')).toBe('formatted-commit (true)');

    toggle(wrapper, 'autofmt', false);
    field = input(wrapper, 'commit');

    expect(format).toHaveBeenLastCalledWith(expect.any(Object), false);
    expect(field.prop('preview')).toBe('formatted-commit (false)');
  });

  it('renders a template-input for the command format', () => {
    const wrapper = render({});
    const instance = wrapper.instance();

    const field = input(wrapper, 'command');

    expect(field.props()).toEqual({
      icon: expect.any(Object),
      label: 'Command Format',
      id: 'command-format',
      name: 'command',
      value: '',
      multiline: false,
      fallback: fallbacks.command,
      preview: expect.any(String),
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('renders a checkbox to toggle commit message auto-formatting', () => {
    const wrapper = render({});
    const instance = wrapper.instance();

    const field = checkbox(wrapper, 'autofmt');

    expect(field.props()).toEqual(
      expect.objectContaining({
        name: 'autofmt',
        checked: true,
        disabled: true,
        onChange: instance.handleChanged,
      })
    );
  });

  it('renders the names of available template helpers', () => {
    const wrapper = render({});
    const text = wrapper.text();

    Object.keys(helpers).forEach((name) => {
      expect(text).toContain(name);
    });
  });

  it('loads stored templates and options on mount and updates the form inputs', async () => {
    const store = { get: jest.fn(), set: jest.fn() };

    let loaded;

    store.get.mockReturnValue(
      new Promise((resolve) => {
        // Create a new async function that resolves the promise returned from
        // calls to `store.get()` and returns a promise itself which we can wait
        // on to ensure the store results have been handled.
        loaded = async function load(data) {
          resolve(data);
        };
      })
    );

    const wrapper = render({ store });

    expect(store.get).toHaveBeenCalledWith(null);
    expect(inputs(wrapper).every({ disabled: true })).toBe(true);

    await loaded({
      templates: { branch: 'a', commit: 'b', command: 'c' },
      options: { autofmt: false },
    });

    expect(checked(wrapper, 'autofmt')).toBe(false);
    expect(value(wrapper, 'branch')).toBe('a');
    expect(value(wrapper, 'commit')).toBe('b');
    expect(value(wrapper, 'command')).toBe('c');

    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });

  it('updates the form inputs on changes', () => {
    const wrapper = render({});

    toggle(wrapper, 'autofmt', false);
    expect(checked(wrapper, 'autofmt')).toBe(false);

    change(wrapper, 'branch', 'branch++');
    expect(value(wrapper, 'branch')).toBe('branch++');

    change(wrapper, 'commit', 'commit++');
    expect(value(wrapper, 'commit')).toBe('commit++');

    change(wrapper, 'command', 'command++');
    expect(value(wrapper, 'command')).toBe('command++');
  });

  it('stores templates and options on submit and disables form elements while saving', async () => {
    const store = { get: jest.fn(), set: jest.fn() };

    let saved;

    const unchanged = {
      templates: {
        summary: 'summary',
        branch: 'branch',
        commit: 'commit',
        command: 'command',
      },
      options: { autofmt: true },
    };

    store.get.mockResolvedValue(unchanged);
    store.set.mockReturnValue(
      new Promise((resolve) => {
        // Create a new async function that resolves the promise returned from
        // calls to `store.set()` and returns a promise itself which we can wait
        // on to ensure data saving has been handled.
        saved = async function save() {
          resolve();
        };
      })
    );

    const wrapper = render({ store });

    toggle(wrapper, 'autofmt', false);
    change(wrapper, 'summary', 'summary++');
    change(wrapper, 'branch', 'branch++');
    change(wrapper, 'commit', 'commit++');
    change(wrapper, 'command', 'command++');

    const event = { preventDefault: jest.fn() };
    wrapper.simulate('submit', event);

    expect(event.preventDefault).toHaveBeenCalled();

    const changed = {
      templates: {
        summary: 'summary++',
        branch: 'branch++',
        commit: 'commit++',
        command: 'command++',
      },
      options: { autofmt: false },
    };

    expect(store.set).toHaveBeenCalledWith(changed);

    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(true);
    expect(checkbox(wrapper, 'autofmt').prop('disabled')).toBe(true);
    expect(inputs(wrapper).every({ disabled: true })).toBe(true);

    await saved();

    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(false);
    expect(checkbox(wrapper, 'autofmt').prop('disabled')).toBe(false);
    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });
});
