"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('Setting global prefix to: /api');
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'https://hush.local:8443',
            'http://hush.local:8080',
            'http://localhost:3000',
        ],
        credentials: true,
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`✅ Server is running on http://localhost:${port}`);
    console.log(`✅ API is available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map