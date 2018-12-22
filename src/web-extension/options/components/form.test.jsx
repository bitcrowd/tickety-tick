import React from 'react';
import { shallow } from 'enzyme';

import Form from './form';
import TemplateInput from './template-input';

import { defaults as fallbacks, helpers } from '../../../common/format';

describe('form', () => {
  function render(overrides) {
    const store = { get: jest.fn(), set: jest.fn() };
    const defaults = { store };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<Form {...props} />);
    const instance = wrapper.instance();

    return { wrapper, instance, props };
  }

  const inputs = wrapper => wrapper.find(TemplateInput);
  const input = (wrapper, name) => inputs(wrapper).find({ name });
  const value = (wrapper, name) => input(wrapper, name).prop('value');

  const change = (wrapper, instance, name, val) => {
    const event = { target: { name, value: val } };
    instance.handleChanged(event);
    wrapper.update();
  };

  it('renders a template-input for the branch name format', () => {
    const { wrapper, instance } = render({});
    expect(input(wrapper, 'branch').props()).toEqual({
      label: 'Branch Name Format',
      id: 'branch-name-format',
      name: 'branch',
      value: '',
      fallback: fallbacks.branch,
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('renders a template-input for the commit message format', () => {
    const { wrapper, instance } = render({});
    expect(input(wrapper, 'commit').props()).toEqual({
      label: 'Commit Message Format',
      id: 'commit-message-format',
      name: 'commit',
      value: '',
      fallback: fallbacks.commit,
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('renders a template-input for the command format', () => {
    const { wrapper, instance } = render({});
    expect(input(wrapper, 'command').props()).toEqual({
      label: 'Command Format',
      id: 'command-format',
      name: 'command',
      value: '',
      fallback: fallbacks.command,
      disabled: true,
      onChange: instance.handleChanged,
    });
  });

  it('renders the names of available template helpers', () => {
    const { wrapper } = render({});
    const text = wrapper.text();

    Object.keys(helpers).forEach((name) => {
      expect(text).toContain(name);
    });
  });

  it('loads stored templates on mount', () => {
    const store = { get: jest.fn(), set: jest.fn() };
    const data = { templates: { branch: 'a', commit: 'b', command: 'c' } };
    store.get.mockImplementation((_, fn) => fn(data));

    const { instance } = render({ store });
    jest.spyOn(instance, 'handleLoaded');

    instance.componentDidMount();

    expect(store.get).toHaveBeenCalledWith(null, instance.handleLoaded);
    expect(instance.handleLoaded).toHaveBeenCalledWith(data);
  });

  it('updates the form inputs once templates are loaded', () => {
    const { wrapper, instance } = render({});
    const data = { templates: { branch: 'x', commit: 'y', command: 'z' } };

    instance.handleLoaded(data);
    wrapper.update();

    expect(value(wrapper, 'branch')).toBe('x');
    expect(value(wrapper, 'commit')).toBe('y');
    expect(value(wrapper, 'command')).toBe('z');

    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });

  it('updates the form inputs on changes', () => {
    const { wrapper, instance } = render({});

    change(wrapper, instance, 'branch', 'branch++');
    expect(value(wrapper, 'branch')).toBe('branch++');

    change(wrapper, instance, 'commit', 'commit++');
    expect(value(wrapper, 'commit')).toBe('commit++');

    change(wrapper, instance, 'command', 'command++');
    expect(value(wrapper, 'command')).toBe('command++');
  });

  it('stores templates on submit', () => {
    const store = { get: jest.fn(), set: jest.fn() };
    store.set.mockImplementation((_, fn) => fn());

    const { wrapper, instance } = render({ store });
    jest.spyOn(instance, 'handleSaved').mockReturnValue();

    change(wrapper, instance, 'branch', 'branch++');
    change(wrapper, instance, 'commit', 'commit++');
    change(wrapper, instance, 'command', 'command++');

    const event = { preventDefault: jest.fn() };
    wrapper.simulate('submit', event);

    expect(event.preventDefault).toHaveBeenCalled();

    const templates = { branch: 'branch++', commit: 'commit++', command: 'command++' };
    expect(store.set).toHaveBeenCalledWith({ templates }, instance.handleSaved);
    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(true);
    expect(inputs(wrapper).every({ disabled: true })).toBe(true);
    expect(instance.handleSaved).toHaveBeenCalled();
  });

  it('re-enables the form elements once templates are stored', () => {
    const { wrapper, instance } = render({});

    wrapper.simulate('submit', { preventDefault: () => {} });
    instance.handleSaved();
    wrapper.update();

    expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(false);
    expect(inputs(wrapper).every({ disabled: false })).toBe(true);
  });
});
