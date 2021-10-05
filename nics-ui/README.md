# Environment Setup

## Node 14.x

Install [Node version 14.x](https://nodejs.org/en/download/package-manager)

## NPM or Yarn

NPM comes with your installation of Node. An alternative to NPM is [Yarn](https://yarnpkg.com/getting-started/install), which you can install using NPM. There are small differences, but both do the same thing. Just make sure you commit to using one or the other.


## NVM

Optionally, you can install NVM to let you switch easily between node versions. This is helpful if you work with Node on more than one project. If you're using NVM, make sure to either switch t the correct version for the project or set your default version.


### Building & Running the Application

### `npm install`

Install all of the required packages. If you're using yarn, run 'yarn install'.


### `npm start`

If successful, your browser should open up to localhost:3000 and display the application. If you're using yarn, run 'yarn start'.

## API URL

The default API URL uses is https://dev3.hadrsys.info/api/v1 on DEV3 environment. To change this to DEMO2 environment use 'REACT_APP_API_URL=https://demo2.hadrsys.info/api/v1 npm start'.
