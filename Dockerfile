FROM node:20.10.0
WORKDIR /home/aryan/judge0

COPY package*.json ./

RUN npm install 

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]