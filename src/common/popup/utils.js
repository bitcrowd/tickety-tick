/* globals window, document, prompt */

import $ from 'jquery';
import bowser from 'bowser';

// TODO: remove browser switches completely
// TODO: remove jquery

let currentTickets = [];

function copyToClipboard(text) {
  if (bowser.chrome || bowser.firefox) {
    const copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
  } else if (bowser.safari) {
    prompt('Here you go:', text); // eslint-disable-line no-alert
  }
}

function closeWindow() {
  if (bowser.chrome || bowser.firefox) {
    window.close();
  } else if (bowser.safari) {
    safari.self.hide();
  }
}

function displayHowto() {
  $('#content').empty();

  $('#content').append(`
    <h1><img src="../icons/icon-16.png"/> tickety-tick</h1>
    <p>Open a ticket and then click this extension.</p>
    <p>
      You then can select if you want to create a commit message or a branch name 
      based on that ticket.
    </p><p>
      If you have selected more than one ticket, you can then select 
      the ticket to use.
    </p><p>
      Logo by <a class="external" target="_blank" href="http://thenounproject.com/term/ticket/92194/">Alejandro Santander</a> under CC-BY&nbsp;3.0
    </p>
  `);

  $(':focus').blur();
}

function cleanTitleForGitBranch(storyType, title) {
  const translate = {
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
  };

  const titlePart = title.toLowerCase()
    .replace(/[öäüß]/g, (match) => translate[match])
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');

  const cleanedTitle = `${storyType || 'feature'}/${titlePart}`;

  return cleanedTitle;
}

function displayTicketSelect(tickets) {
  currentTickets = tickets;
  $('#content').empty();
  $('#content').append('<h1>Select the Ticket:</h1>');

  const ticketList = tickets.sort((a, b) => a.title.localeCompare(b.title))
    .map((ticket, index) => `<li><a href="#" class="select-ticket" data-ticket-number="${index}">${ticket.title}</a></li>`);

  $('#content').append(`<ul class="ticket-list">${ticketList.join('')}</ul>`);
  $('#content a').first().focus();

  $('.select-ticket').click((event) => {
    const number = $(event.target).attr('data-ticket-number');
    displayCopyPanel(currentTickets[number]);
    event.preventDefault();
  });
}

function displayCopyPanel(ticket) {
  $('#content').empty();

  const commitMessage = `[#${ticket.id}] ${ticket.title}`;
  const gitBranch = cleanTitleForGitBranch(ticket.type, `${ticket.id}-${ticket.title}`);

  $('<h1/>').text(commitMessage).appendTo($('#content'));

  const linkList = `
    <ul class="button-list">
      <li><a href="#" class="to-clipboard" data-clipboard-text="${escape(commitMessage)}">Commit message</a></li>
      <li><a href="#" class="to-clipboard" data-clipboard-text="${escape(gitBranch)}">Branch name</a></li>
    </ul>
  `;
  $('#content').append(linkList);

  if (currentTickets.length > 1) {
    $('#content').append('<p><a href="#" class="to-select">&laquo; Zurück</a></p>');

    $('.to-select').click((event) => {
      displayTicketSelect(currentTickets);
      event.preventDefault();
    });
  }

  $('#content a').first().focus();
}

function updateTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    displayHowto();
  } else if (tickets.length > 1) {
    displayTicketSelect(tickets);
  } else if (tickets.length === 1) {
    displayCopyPanel(tickets[0]);
  }
}

$('body').on('click', 'a.external', (event) => {
  setTimeout(() => {
    closeWindow();
  }, 100);

  if (bowser.safari) {
    safari.application.activeBrowserWindow.openTab().url = $(this).attr('href');
    event.preventDefault();
  }
});

$('body').on('click', '.to-clipboard', (event) => {
  const text = unescape($(event.target).attr('data-clipboard-text'));
  event.preventDefault();
  copyToClipboard(text);
  closeWindow();
});

$('body').on('click', '.about', (event) => {
  event.preventDefault();
  displayHowto();
});

export { updateTickets };
