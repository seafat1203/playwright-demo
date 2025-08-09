FROM mcr.microsoft.com/playwright:v1.54.2-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 可选但稳妥：确保该版本浏览器已安装
RUN npx playwright install --with-deps chromium

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","run","web"]
