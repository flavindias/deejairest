# deejAI REST
A Simple REST API

## Requirements
* Spotify application ID (https://developer.spotify.com/dashboard/applications)
* Node
* NPM
* Express
* Mongoose

### Folder structure

    .
    ├── __tests__               # Automated tests (alternatively `spec` or `tests`)
    ├── docs                    # Documentation files (alternatively `doc`)
    ├── src                     # Source files (alternatively `lib` or `app`)
    |   ├── app     
    |   |   ├── controllers     # Controllers folder
    |   |   ├── middleware      # Middleware folder
    |   |   └── models          # Models folder
    |   ├── config              # Database and app config
    |   └── database    
    |       └── migragrions     # Migragion folder
    ├── .env                    # .env development/production environment variables file
    ├── .env.test               # .env test environment variables file
    ├── .gitignore              # .gitignore
    ├── LICENSE
    ├── package.json            # Dependences info.
    └── README.md

## Common setup

Clone the repo and install the dependencies.

```bash
git clone git@github.com:flavindias/deejairest.git
cd deejairest
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.

