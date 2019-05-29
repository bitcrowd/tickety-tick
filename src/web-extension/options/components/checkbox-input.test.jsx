import React from 'react';
import { shallow } from 'enzyme';

import CheckboxInput from './checkbox-input';

describe('checkbox-input', () => {
  function render(overrides) {
    const defaults = {
      id: 'checkbox-input-id',
      name: 'checkbox-input-name',
      label: <span>label</span>,
      checked: true,
      disabled: false,
      onChange: jest.fn(),
    };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<CheckboxInput {...props} />);

    return wrapper;
  }

  it('renders an input label', () => {
    const wrapper = render({ id: 'id-1', label: <span>Awesome Label</span> });
    const label = wrapper.find('label');
    expect(label.prop('htmlFor')).toBe('id-1');
    expect(label.contains(<span>Awesome Label</span>)).toBe(true);
  });

  it('renders an input field', () => {
    const wrapper = render({ id: 'id-2', name: 'name-2', value: true });
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.prop('id')).toBe('id-2');
    expect(input.prop('name')).toBe('name-2');
    expect(input.prop('checked')).toBe(true);
  });

  it('notifies about input changes', () => {
    const onChange = () => 'called on change';
    const wrapper = render({ onChange });
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.prop('onChange')).toBe(onChange);
  });

  it('disables the input if requested', () => {
    const wrapper = render({ disabled: true });
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.prop('disabled')).toBe(true);
  });
});
