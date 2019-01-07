import React from 'react';
import { shallow } from 'enzyme';

import Form from './form';
import TemplateInput from './template-input';

import { defaults as fallbacks, helpers } from '../../../common/format';

describe('form', () => {
  function render(overrides, options = {}) {
    const store = { get: jest.fn().mockResolvedValue({}), set: jest.fn().mockResolvedValue({}) };
    const defaults = { store };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<Form {...props} />, options);

    return wrapper;
  }

  const inputs = wrapper => wrapper.find(TemplateInput);
  const input = (wrapper, name) => inputs(wrapper).find({ name });
  const value = (wrapper, name) => input(wrapper, name).prop('value');

  const change = (wrapper, name, val) => {
    const event = { target: { name, value: val } };
    const field = wrapper.find(TemplateInput).find({ name });
    field.simulate('change', event);
  };

  it('renders a template-input for the branch name format', () => {
    const wrapper = render({});
    const field = input(wrapper, 'branch');

    expect(field.props()).toEqual({
      label: 'Branch Name Format',
      id: 'branch-name-format',
      name: 'branch',
      value: '',
      fallback: fallbacks.branch,
      disabled: true,
      onChange: expect.any(Function),
    });
  });

  it('renders a template-input for the commit message format', () => {
    const wrapper = render({});
    const field = input(wrapper, 'commit');

    expect(field.props()).toEqual({
      label: 'Commit Message Format',
      id: 'commit-message-format',
      name: 'commit',
      value: '',
      fallback: fallbacks.commit,
      disabled: true,
      onChange: expect.any(Function),
    });
  });

  it('renders a template-input for the command format', () => {
    const wrapper = render({});
    const field = input(wrapper, 'command');

    expect(field.props()).toEqual({
      label: 'Command Format',
      id: 'command-format',
      name: 'command',
      value: '',
      fallback: fallbacks.command,
      disabled: true,
      onChange: expect.any(Function),
    });
  });

  it('renders the names of available template helpers', () => {
    const wrapper = render({});
    const text = wrapper.text();

    Object.keys(helpers).forEach((name) => {
      expect(text).toContain(name);
    });
  });

  it('loads stored templates on mount and updates the form inputs', async () => {
    const store = { get: jest.fn(), set: jest.fn() };

    let loaded;

    store.get.mockReturnValue(new Promise((resolve) => {
      // Create a new async function that resolves the promise returned from
      // calls to `store.get()` and returns a promise itself which we can wait
      // on to ensure the store results have been handled.
      loaded = async function load(data) { resolve(data); };
    }));

    const wrapper = render({ store });

    expect(store.get).toHaveBeenCalledWith(null);
    expect(inputs(wrapper).every({ disabled: true })).toBe(true);

    await loaded({ templates: { branch: 'a', commit: 'b', command: 'c' } });

    expect(value(wrapper, 'branch')).toBe('a');
    expect(value(wrapper, 'commit')).toBe('b');
    expect(value(wrapper, 'command')).toBe('c');

    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });

  it('updates the form inputs on changes', () => {
    const wrapper = render({});

    change(wrapper, 'branch', 'branch++');
    expect(value(wrapper, 'branch')).toBe('branch++');

    change(wrapper, 'commit', 'commit++');
    expect(value(wrapper, 'commit')).toBe('commit++');

    change(wrapper, 'command', 'command++');
    expect(value(wrapper, 'command')).toBe('command++');
  });

  it('stores templates on submit and disables form elements while saving', async () => {
    const store = { get: jest.fn(), set: jest.fn() };

    let saved;

    const unchanged = { branch: 'branch', commit: 'commit', command: 'command' };
    store.get.mockResolvedValue({ templates: unchanged });
    store.set.mockReturnValue(new Promise((resolve) => {
      // Create a new async function that resolves the promise returned from
      // calls to `store.set()` and returns a promise itself which we can wait
      // on to ensure data saving has been handled.
      saved = async function save() { resolve(); };
    }));

    const wrapper = render({ store });

    change(wrapper, 'branch', 'branch++');
    change(wrapper, 'commit', 'commit++');
    change(wrapper, 'command', 'command++');

    const event = { preventDefault: jest.fn() };
    wrapper.simulate('submit', event);

    expect(event.preventDefault).toHaveBeenCalled();

    const changed = { branch: 'branch++', commit: 'commit++', command: 'command++' };
    expect(store.set).toHaveBeenCalledWith({ templates: changed });

    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(true);
    expect(inputs(wrapper).every({ disabled: true })).toBe(true);

    await saved();

    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(false);
    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });
});
