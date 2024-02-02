FROM node:18-alpine as dev
WORKDIR /src/app/
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM dev as prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /src/app/
COPY package*.json .
RUN npm ci --onLy=production
COPY --from=dev /src/app/dist ./dist
CMD ["node", "dist/index.js"]
