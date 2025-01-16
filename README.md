Project for order control of a Cake Shop  

Backend (in progress) made using nodejs (typescript) with fastify and drizzle-orm  
For database is being used postgres  

Frontend (pending) will be an app and an site:  
* App will be made with flutter  
* Site will be made with react  

Steps to initialize project
1. RUN: npm install
2. RUN: docker-compose up
3. RUN: npx drizzle-kit generate
4. RUN: npx drizzle-kit migrate
5. RUN: npm run dev



To visualize the database on the web, can be used the drizzle-kit studio:
1. RUN: npx drizzle-kit studio