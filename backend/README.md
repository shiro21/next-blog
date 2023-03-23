### TEST중
gsutil cors set cors.json gs://blog-next-c18f3.appspot.com

### npm install
<!-- Cors -->
npm install --save-dev @types/cors
<!-- Express -->
npm install -D express ts-node @types/node @types/express
npm install @types/express-serve-static-core
<!-- Body Parser -->
npm install body-parser
<!-- Cookie Parser -->
npm install cookie-parser
npm install @types/cookie-parser
npm install dotenv
<!-- Mongoose -->
npm install mongoose
<!-- Crypto -->
npm install crypto-js
npm install @types/crypto-js
<!-- Json Web Token -->
npm install jsonwebtoken
npm install @types/jsonwebtoken
<!-- Node Mailer -->
npm install nodemailer
npm install --save @types/nodemailer
<!-- Multer -->
npm install multer@1.4.3
npm install @types/multer@1.4.3
<!-- Firebase -->
npm install multer-firebase-storage
npm install firebase-functions firebase-admin
<!-- busboy -->
npm install busboy
npm install @types/busboy
npm install busboy-firebase
<!-- Formidable -->
npm install formidable-serverless
<!-- Multiparty -->
npm install multiparty
npm install @types/multiparty
<!-- Moment -->
npm install moment
npm install moment-timezone
<!-- User Agent -->
npm install express-useragent
npm install @types/express-useragent
<!-- UUID -->
npm install uuid
<!-- GOOGLE CLOUD -->
npm install @google-cloud/functions-framework

<!-- 아직 미설치 -->
npm uninstall @firebase/app-types
npm install firebase/app-types

<!-- 현재 해결해야할 문제 -->
nodejs firebase deploy

npm install -D typescript @types/node

npx tsc --init

## Start
npm run dev

## Firebase
npm install firebase
npm install @types/firebase
npm install -g firebase-tools
firebase login

firebase init functions
firebase init
firebase deploy
nextjs-blog-server -> npm run deploy

<!-- add 추가, list 아이디 확인, use 변경 -->
firebase login:add
firebase login:list
firebase login:use

firebase logout
firebase login

firebase login:add david@example.com
firebase login:add alice@example.com
firebase login:add bob@example.com
firebase login:use alice@example.com
firebase login:list
firebase deploy --only hosting # deploy as alice@example.com

firebase init
firebase deploy
firebase deploy --only hosting

firebase emulators:start