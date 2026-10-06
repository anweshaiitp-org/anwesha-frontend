const fs = require('fs');
const path = 'C:\\Users\\lenovo\\OneDrive\\Desktop\\anwesha-backend2k27\\infrastructure\\lib\\api-stack.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  "restApiName: 'Anwesha API'",
  "restApiName: 'Anwesha API',\n      defaultCorsPreflightOptions: {\n        allowOrigins: apigateway.Cors.ALL_ORIGINS,\n        allowMethods: apigateway.Cors.ALL_METHODS,\n        allowHeaders: ['*'],\n      }"
);
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully added CORS to api-stack.ts');
