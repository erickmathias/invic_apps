# Base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

#install latest npm
#RUN npm i -g npm@latest
# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build the Angular app
#RUN npm run build
RUN npm run build -- --configuration=production
#RUN #npm run build -- --configuration=production --base-href /scard/

# Stage 2: Serve the app using Nginx
FROM nginx:1.21-alpine

# copy nginx conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built app from the previous stage
COPY --from=build /usr/src/app/dist/skote /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
