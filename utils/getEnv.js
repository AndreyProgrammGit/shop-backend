"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
function getEnv(configService, key) {
    const value = configService.get(key);
    if (typeof value !== 'string')
        throw new Error(`Missing or invalid env variable: ${key}`);
    return value;
}
//# sourceMappingURL=getEnv.js.map