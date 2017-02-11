# Stock-market-now!

## Overview

Here are the specific user stories you should implement for this project:
User Story: I can view a graph displaying the recent trend lines for each added stock.
User Story: I can add new stocks by their symbol name.
User Story: I can remove stocks.
User Story: I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.

# Quick Start Guide

### Prerequisites

In order to use this app, you must have the following installed:

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [MongoDB](http://www.mongodb.org/)
- [Git](https://git-scm.com/)

### Installation & Startup

To install this app, simply enter the below in the terminal window:

```bash
$ git clone https://github.com/Juancard/stock-market-now your-project
```

To install the dependencies, enter the following in your terminal:

```
$ cd your-project
$ npm install
```

This will install the night-me-out components into the `your-project` directory.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
MONGO_URI=mongodb://localhost:27017/stock-market-now
PORT=8080
APP_URL=http://localhost:8080/
```

### Starting the App

To start the app, make sure you're in the project directory and type `node server.js` into the terminal. This will start the Node server and connect to MongoDB.

You should the following messages within the terminal window:

```
Node.js listening on port 8080...
```

Next, open your browser and enter `http://localhost:8080/`. Congrats, you're up and running!

## License

MIT License. [Click here for more information.](LICENSE.md)
