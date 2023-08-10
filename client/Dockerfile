FROM node
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 5713
CMD ["npm", "run", "dev"]