FROM node

WORKDIR /app

COPY app/package.json /app/package.json

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]