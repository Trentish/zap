FROM node:24.4.1-bullseye-slim

WORKDIR /workspace

COPY package*.json ./

RUN npm install --include=dev

COPY . .

# Set permissions for the node user (optional, but good practice)
RUN chown -R node:node /workspace

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
