FROM node:20.12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Ganti port sesuai yang dipakai di masing-masing service
EXPOSE 8080

CMD ["npm", "run", "dev"]

