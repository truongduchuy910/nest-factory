ARG BASE=node:20-alpine

#------------------------------------------------
FROM $BASE AS base
WORKDIR /app
#------------------------------------------------


#------------------------------------------------
FROM base as installer
WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json package-lock.json

RUN npm install
#------------------------------------------------


#------------------------------------------------
FROM base as builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .

RUN npm run build
#------------------------------------------------


#------------------------------------------------
FROM base as dev
WORKDIR /app
COPY . .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/package-lock.json ./package-lock.json
COPY package.json ./package.json

ENV NODE_ENV=development
CMD ["/bin/sh", "-c", "npm run start:dev"]
#------------------------------------------------


#------------------------------------------------
FROM base as prod
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json

ENV NODE_ENV=production
CMD ["/bin/sh", "-c", "npm run start:prod"]
#------------------------------------------------


#------------------------------------------------
# This target run as container, internal networking.
FROM base as migr
WORKDIR /app
COPY prisma prisma

RUN npm install prisma --save-dev
CMD ["/bin/sh", "-c", "npx prisma migrate deploy"]
#------------------------------------------------

EXPOSE 3000
EXPOSE 50051

