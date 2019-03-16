import React from 'react';
import { shallow } from 'enzyme';

import TemplateInput from './template-input';

describe('template-input', () => {
  function render(overrides) {
    const defaults = {
      id: 'template-input-id',
      name: 'template-input-name',
      label: 'template-label',
      icon: <span>icon</span>,
      value: 'template-value',
      fallback: 'template-fallback',
      disabled: false,
      onChange: jest.fn(),
      preview: 'template-preview',
    };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<TemplateInput {...props} />);

    return wrapper;
  }

  it('renders an input label', () => {
    const wrapper = render({ id: 'id-1', label: 'Awesome Template Label' });
    const label = wrapper.find('label');
    expect(label.prop('htmlFor')).toBe('id-1');
    expect(label.text()).toContain('Awesome Template Label');
  });

  it('renders an input label icon', () => {
    const icon = <span>icon</span>;
    const wrapper = render({ id: 'id-2', icon });
    const label = wrapper.find('label');
    expect(label.prop('htmlFor')).toBe('id-2');
    expect(label.contains(icon)).toBe(true);
  });

  it('renders an input field', () => {
    const wrapper = render({ id: 'id-2', name: 'name-2', value: 'vvv' });
    const input = wrapper.find('input');
    expect(input.prop('id')).toBe('id-2');
    expect(input.prop('name')).toBe('name-2');
    expect(input.prop('value')).toBe('vvv');
  });

  it('notifies about input changes', () => {
    const onChange = () => 'called on change';
    const wrapper = render({ onChange });
    const input = wrapper.find('input');
    expect(input.prop('onChange')).toBe(onChange);
  });

  it('disables the input if requested', () => {
    const wrapper = render({ disabled: true });
    const input = wrapper.find('input');
    expect(input.prop('disabled')).toBe(true);
  });

  it('renders the default value used as a fallback', () => {
    const wrapper = render({ fallback: 'fbfbfb' });
    const input = wrapper.find('input');
    expect(input.prop('placeholder')).toContain('fbfbfb');
  });
});
