FROM node:20.10.0 As base
WORKDIR /app/judge0

COPY package*.json .

RUN npm install 

COPY . .

ENV PORT=3000
EXPOSE 3000

FROM  base As prod 
CMD ["npm","start"]

FROM base As dev
CMD [ "npm" ,"run" ,"dev"]