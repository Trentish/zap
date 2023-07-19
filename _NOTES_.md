## dev
- set up: run `npm install` in both /zap-server and /zap-client
- run server: /zap-server `npm run dev`
- run client: /zap-client `npm run dev`
- client terminal will tell you where to go, should be something like `http://127.0.0.1:5173/`
- `STORAGE_PATH` environment variable determines where files are stored to, e.g. `C:/Zap`

## Routing
- clientURL.com / admin / {gameIdf}
- clientURL.com / player / {gameIdf}
- clientURL.com / projector / {gameIdf}
- e.g.  http://127.0.0.1:5173/projector/deephaven

