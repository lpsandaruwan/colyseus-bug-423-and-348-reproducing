# Bug 348 reproducing
This is a helper client for inspecting Colyseus bug #348.

## Dependencies

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`


## Usage
Before starting the client please configure the server host in src->App.tsx
```
const COLYSEUS_SERVER = "ws://192.168.8.163:2567";
```
Fist run the game server and in browser log into `{host}:3000`
Then disconnect the client device from network to test.
