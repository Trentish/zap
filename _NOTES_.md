
## TODO: need
- [ ] DH Proj: turn label too big
- [ ] DH Proj: crawler size/height
- [ ] Player: basic styling
- [ ] Player: timer styling
- [ ] DH Audio: volume balance (can use org.introVolume, etc.)
- [ ] asdf
- [ ] asdf
- [ ] asdf
## TODO: nice to have
- [ ] Admin: Timer niceties, save, restart, etc.
- [ ] Player: default Org selection
- [ ] Player: guidelines, examples
- [ ] asdf
- [ ] asdf
- [ ] asdf
- [ ] asdf
- [ ] asdf
- [ ] asdf
- [ ] asdf
- [ ] asdf



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
- jotai: reference-based state management, `atom`, `useAtom` https://jotai.org/ 
- clsx: constructs className string conditionally https://github.com/lukeed/clsx
- 
