FROM node:20.13.1-alpine AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /src/app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm install

# Bundle app source / copy all other files
COPY . .

# RUN chown -R node /src/app/node_modules

# Build the app to the /dist folder
RUN npx prisma generate
# RUN npm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:20.13.1-alpine AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /src/app

# Copy all from development stage
COPY --from=development /src/app .

EXPOSE 8080

# Run app
RUN npx prisma generate
RUN npm run build
CMD [ "node", "dist/main" ]