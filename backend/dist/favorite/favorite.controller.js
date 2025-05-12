"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const create_favorite_dto_1 = require("./dto/create-favorite.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FavoriteController = class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }
    create(req, createFavoriteDto) {
        return this.favoriteService.create(req.user.id, createFavoriteDto);
    }
    remove(req, apodId) {
        return this.favoriteService.remove(req.user.id, apodId);
    }
    findUserFavorites(req) {
        return this.favoriteService.findUserFavorites(req.user.id);
    }
};
exports.FavoriteController = FavoriteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_favorite_dto_1.CreateFavoriteDto]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":apodId"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("apodId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "findUserFavorites", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, common_1.Controller)("favorites"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map