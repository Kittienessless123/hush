"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const CurrentUser = (...args) => (0, common_1.SetMetadata)('current-user', args);
exports.CurrentUser = CurrentUser;
//# sourceMappingURL=current-user.decorator.js.map