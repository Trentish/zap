# Zap Purpose
Zap is a networked web app for megagames. It's primary purpose is to display:
1. Turn clock/timer
2. News headlines

# Background
Created by Trenton Greyoak and Jed Limke. Heavily inspired by Jed's original headline tech. Due to time constraints, code quality is "average" at best and "hacky af" in some places. Some code was even written _during_ GenCon. 😱

# TODO
- [x] Make repo public
- [ ] Write documentation & usage guide
- [ ] Clarify code standards & open source "stuff"
- [ ] Code cleanup
- [ ] Better standardization of CSS & module styling
- [ ] More/better generic modules
- [ ] Write more TODOs 😉 (& start using Issues)

# OLD notes, will update soon (TODO)

## dev
- install `nvm` and set the default Node version to `16`
- set up: run `npm install` in both /zap-server and /zap-client
- run server: /zap-server `npm run dev`
- run client: /zap-client `npm run dev`
- client terminal will tell you where to go, should be something like `http://127.0.0.1:5173/`
- `STORAGE_PATH` environment variable determines where files are stored to, e.g. `C:/Zap`
- note: changes in zap-shared may not be auto-detected

## Routing
- clientURL.com / admin / {gameIdf}
- clientURL.com / player / {gameIdf}
- clientURL.com / projector / {gameIdf}
- e.g.  http://127.0.0.1:5173/projector/deephaven


## Naming Convention
- atom: `$nameOfAtom`


## Libraries
Client:
- react: frontend
- jotai: reference-based state management, `atom`, `useAtom` https://jotai.org/ 
- clsx: constructs className string conditionally https://github.com/lukeed/clsx
- vite: frontend build tool / dev fast refresh

Server:
- uWebSockets.js: simple & fast web server (& websockets)
