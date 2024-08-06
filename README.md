# Trivia API

This is a trivia API built using [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/), [MongoDB](https://mongodb.com/pt-br/docs/), [Mongoose](https://mongoosejs.com/) and [Docker](https://docs.docker.com/).
To generate the trivia, there is an integration with [Open Trivia DB](https://opentdb.com/api_config.php).

- [API Postman Docs](https://documenter.getpostman.com/view/16817037/2sA3rzHsBu#e0dd97fc-9101-4b09-98a2-df746c49ccad).

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ingridflack/trivia-api.git
    ```
2. Add a .env file following the example below:
    ```bash
    JWT_KEY=RANDOM_STRING # Example: b22c93ed9488b610419eb22674486f81c03913cf5ec54b8666f4d53b00fee257
    ```
3. Install the dependencies:
    ```bash
    yarn
    ```
4. Run `yarn up` to build and run the containers
   
## Prerequisites

- Node
- Yarn
- Docker 

## Features

- Register a new user; 
- Get a list of all users;
- Update a user;
- Get the trivia history from a user;
- Delete a user;
- Login;
- Generate a Trivia Game choosing the number of questions, category, difficulty, and type;
- Invite friends to play;
- Complete the Trivia;
- Get all possible Trivia categories.

## Features in progress

- Unit tests;
- Account recovery.
