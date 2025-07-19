FROM node:16-bullseye-slim

WORKDIR /workspace

COPY app/package*.json ./

RUN npm install --include=dev

COPY app/ .

# Set permissions for the node user (optional, but good practice)
RUN chown -R node:node /workspace

USER node

EXPOSE 3007

# CMD ["npm", "run", "dev"]