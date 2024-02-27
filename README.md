# EZMail - CS50W Project

This repository contains my project submission for the "Mail" project, part of Harvard University's CS50’s Web Programming with Python and JavaScript course. My contribution focused exclusively on developing the front-end aspects of the email client, utilizing HTML and JavaScript to enable users to send, receive, and manage emails through API calls. 
- [Project Specifications](https://cs50.harvard.edu/web/2020/projects/3/mail/)
## Getting Started

To run this project locally, follow these steps:

1. Clone the repo using `git clone https://github.com/Shefaabi/EZMail`.
2. Navigate into the `mail` directory using `cd EZMail`.
3. Run `python manage.py makemigrations mail` to make migrations for the `mail` app.
4. Execute `python manage.py migrate` to apply migrations to the database.
5. Start the development server with `python manage.py runserver` and visit `http://127.0.0.1:8000/` in your web browser.

### Prerequisites

- Python
- Django

Ensure you have Python and Django installed on your system. If not, follow the instructions on [Python's official website](https://www.python.org/) and [Django's documentation](https://docs.djangoproject.com/en/stable/intro/install/) to get them installed.

## Functionality

- **Send Mail**: Users can compose and send emails.
- **Mailbox**: Users can view their Inbox, Sent, and Archived emails.
- **View Email**: Users can click on an email to view its contents.
- **Archive/Unarchive**: Users can archive or unarchive received emails.
- **Reply**: Users can reply to an email.

## API Usage

The application's backend API supports the following operations:

- `GET /emails/<str:mailbox>`: Fetches emails from the specified mailbox (`inbox`, `sent`, `archive`).
- `GET /emails/<int:email_id>`: Fetches details of a specific email.
- `POST /emails`: Sends an email.
- `PUT /emails/<int:email_id>`: Updates the read or archived status of an email.


## Contributing

This project is part of my coursework and is not open for contribution. However, feedback and suggestions are welcome.

## Credits

- Project prompt and API provided by [CS50W](https://cs50.harvard.edu/web/).

