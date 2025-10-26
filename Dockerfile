FROM mcr.microsoft.com/playwright:v1.55.1-noble
WORKDIR /projectHome

# copy lockfiles first to leverage Docker layer cache
COPY package*.json ./

# install deps, browsers and JRE, then clean caches
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-11-jre-headless && \
    npm ci --no-audit --prefer-offline --progress=false && \
    npx playwright install --with-deps && \
    npm cache clean --force && \
    rm -rf /var/lib/apt/lists/*

# copy rest of repo
COPY . .

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV COMMAND_TO_RUN_TESTS="npm run test"

CMD ["sh", "-c", "$COMMAND_TO_RUN_TESTS"]