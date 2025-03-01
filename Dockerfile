FROM node:23

WORKDIR /app
COPY package*.json ./
RUN pnpm install --only=production
COPY . ./

RUN npm run build

ENTRYPOINT ["node", "/app/dist/index.js"]
