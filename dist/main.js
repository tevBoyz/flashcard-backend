"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const express = require("express");
const server = express();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'));
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map