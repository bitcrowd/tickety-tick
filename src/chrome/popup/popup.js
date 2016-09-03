/* globals chrome */

import { updateTickets } from '../../common/popup/utils';

const extension = chrome.extension;
const background = extension.getBackgroundPage();

background.getTickets((tickets) => {
  updateTickets(tickets);
});
