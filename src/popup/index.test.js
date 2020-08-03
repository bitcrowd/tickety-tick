import '.';

import browser from 'webextension-polyfill';

import { ticket as make } from '../../test/factories';
import enhance from '../core/enhance';
import store from '../store';
import render from './render';

jest.mock('webextension-polyfill', () => {
  const result = { tickets: [], errors: [] };
  const background = { getTickets: jest.fn().mockResolvedValue(result) };
  const extension = { getBackgroundPage: () => background };
  return { extension };
});

jest.mock('../core/enhance', () => jest.fn(() => jest.fn()));

jest.mock('../store', () => ({ get: jest.fn().mockResolvedValue({}) }));

jest.mock('./observe-media');
jest.mock('./render');

describe('popup', () => {
  const initialize = window.onload;

  let background;

  beforeEach(() => {
    background = browser.extension.getBackgroundPage();
    background.getTickets.mockResolvedValue({ tickets: [], errors: [] });
    store.get.mockResolvedValue({});
    enhance.mockReturnValue((x) => x);
  });

  afterEach(() => {
    background.getTickets.mockReset();
    store.get.mockReset();
    enhance.mockReset();
    render.mockReset();
  });

  it('sets up an initialization handler', () => {
    expect(initialize).toEqual(expect.any(Function));
  });

  it('fetches ticket information through the background page', async () => {
    await initialize();

    expect(background.getTickets).toHaveBeenCalled();
  });

  it('loads settings from storage', async () => {
    await initialize();

    expect(store.get).toHaveBeenCalledWith(null);
  });

  it('configures ticket formatting', async () => {
    const templates = { branch: 'test/branch' };
    const options = { autofmt: Math.random() < 0.5 };
    store.get.mockResolvedValue({ templates, options });

    await initialize();

    expect(enhance).toHaveBeenCalledWith(templates, options.autofmt);
  });

  it('renders the popup content with enhanced tickets', async () => {
    const tickets = ['uno', 'dos'].map((title, id) => make({ id, title }));
    background.getTickets.mockResolvedValue({ tickets, errors: [] });

    const format = (ticket) => ({ ...ticket, fmt: true });
    const enhancer = jest.fn(format);
    enhance.mockReturnValue(enhancer);

    await initialize();

    expect(enhance).toHaveBeenCalled();

    expect(render).toHaveBeenCalledWith(
      tickets.map(format),
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('renders the popup content with errors', async () => {
    const errors = [{ message: 'Test Error' }];
    background.getTickets.mockResolvedValue({ tickets: [], errors });

    await initialize();

    expect(render).toHaveBeenCalledWith(
      expect.any(Object),
      errors,
      expect.any(Object)
    );
  });

  it('renders the popup content with context', async () => {
    await initialize();

    expect(render).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      {
        close: expect.any(Function),
        pbcopy: expect.any(Function),
      }
    );
  });
});
