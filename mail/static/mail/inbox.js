document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  document.querySelector('#compose-form').addEventListener('submit', send_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  get_emails(mailbox);
}

function get_emails(mailbox) {
  fetch('/emails/' + mailbox)
    .then(response => {

      if (response.ok) {
        return response.json()
        .then(emails => {
          console.log(emails);
          load_emails(emails, mailbox);
        })
      } else {
        return response.json()
          .then(error => {
            console.error(error);
        })

      }
    })
}

function load_emails(emails, mailbox) {

  emails.forEach((email) => {
    if ((mailbox === 'archive' && email.archived) || (mailbox !== 'archive' && !email.archived)) {
      const element = document.createElement('div');
      element.id = 'email-' + email.id;
      element.innerHTML = `${email.sender}  ${email.subject} ${email.timestamp}`;
      element.style.border = 'thin solid';
      element.style.backgroundColor = (email.read ? 'white' : 'gray')
       
      element.addEventListener('click', () => get_email(email.id, mailbox));
    
      document.querySelector('#emails-view').append(element);
    }
  })
  
   
}


function send_email(event) {
  event.preventDefault()
 
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
  })
  }).then(respose => {
    if (respose.ok) {
      return respose.json().then(result => {
        console.log(result);
        load_mailbox('sent');
      })
    } else {
      return respose.json().then(error => {
        console.error(error);
      })
    }
  
  }).catch(error => {
  console.error(error)
})

 
}


function get_email(id, mailbox) {
  fetch('/emails/' + id)
  .then(response => response.json())
  .then(email => {
      console.log(email);
      load_email_content(email, mailbox);
      update_read_status(email.id)
});
}

function load_email_content(email, mailbox) {
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'none';
   document.querySelector('#email-view').style.display = 'block';
  
  const email_view = document.querySelector('#email-view');
  email_view.innerHTML = 
    `   <div id="from"><strong>From: </strong><span>${email.sender}</span></div>
        <div id="to"><strong>To: </strong><span>${email.recipients}</span></div>
        <div id="subject"><strong>Subject </strong><span>${email.subject}</span></div>
        <div id="timestamp"><strong>Timestamp </strong><span>${email.timestamp}</span></div>
        <button class="btn btn-sm btn-outline-primary" id="replay">Reply</button>
        <button class="btn btn-sm btn-outline-primary" id="archive" hidden>Archive</button>
        <article id="email-content" class="border-top mt-3"></article>`
 
  const replay_button  = document.querySelector('#replay');
  const archive_button = document.querySelector('#archive');

  replay_button.addEventListener('click', ()=> repaly(email))

  if (mailbox === 'inbox' || mailbox === 'archive') {
    archive_button.hidden = false;
    archive_button.innerHTML = (email.archived ? 'unarchive' : 'archive')
    archive_button.addEventListener('click', () => {
      update_archive_status(email.id, email.archived);
    })
    
  } else {
     archive_button.hidden = true;
  }
}

function update_read_status(id) {
  fetch('/emails/' + id, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
  })
}

function update_archive_status(id, is_archive) {
  fetch('/emails/' + id, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !is_archive
  })
  }).then(() => {
    load_mailbox('inbox');
  })
}

function repaly(email) {
  compose_email();
  document.querySelector('#compose-recipients').value = email.sender;
  const subject = email.subject;
  document.querySelector('#compose-subject').value = ((subject.startsWith('Re: ') || subject === 'Re:') ? email.subject : `Re: ${ email.subject } `);
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
}