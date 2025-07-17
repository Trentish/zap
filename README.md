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

## Usage (with Docker Compose)

1. Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2. In the project root, run:

   ```sh
   docker-compose up --build
   ```

   This will start both the server and client, with shared code mounted automatically.

3. Access the client in your browser at: [http://localhost:5173](http://localhost:5173)

4. Data is stored in the `zap-storage/` folder (created automatically, and ignored by git).

5. To stop the app, press `Ctrl+C` in the terminal, or run:

   ```sh
   docker-compose down
   ```

## Development

This project optionally uses [Dev Containers](https://containers.dev/) to provide a consistent, containerized development environment using VS Code or JetBrains IDEs. You can also run everything locally with Docker Compose, no container-based dev setup required.

### Dev Containers in VS Code

1. Install:
   - [VS Code](https://code.visualstudio.com/)
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. Open the project folder in VS Code.

3. When prompted, or from the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`), select:

   `Dev Containers: Reopen in Container`

   VS Code will then build the containers, install dependencies, and open a shell inside the dev environment for `zap-client` (this can be changed via code adjustments in the `.devcontainer/devcontainer.json` file).

5. Inside the container, run

   ```sh
   npm run dev
   ```

   to kick things off.

6. Learn more here: https://code.visualstudio.com/docs/devcontainers/containers

### Dev Containers for IntelliJ

Learn more here: https://blog.jetbrains.com/idea/2024/07/using-dev-containers-in-jetbrains-ides-part-1/

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
