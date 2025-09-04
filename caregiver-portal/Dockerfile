FROM node:18-alpine

WORKDIR /app

# Set environment variables using build arguments
ARG VITE_API_URL
ARG VITE_BCSC_CLIENT_ID
ARG VITE_BCSC_AUTHORITY
ARG VITE_KILN_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BCSC_CLIENT_ID=${VITE_BCSC_CLIENT_ID}
ENV VITE_BCSC_AUTHORITY=${VITE_BCSC_AUTHORITY}
ENV VITE_KILN_URL=${VITE_KILN_URL}

COPY package.json . 
RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "serve", "-s", "dist", "-l", "8080" ]
