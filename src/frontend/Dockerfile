FROM node:18

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app/.env ./

COPY app/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
