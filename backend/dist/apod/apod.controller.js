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
exports.ApodController = void 0;
const common_1 = require("@nestjs/common");
const apod_service_1 = require("./apod.service");
let ApodController = class ApodController {
    constructor(apodService) {
        this.apodService = apodService;
    }
    async fetchAndStore() {
        const today = new Date().toISOString().split('T')[0];
        return this.apodService.findByDate(today);
    }
    getAll(date, search, page, limit) {
        return this.apodService.findAll(date, search, page ? parseInt(page) : 1, limit ? parseInt(limit) : 12);
    }
    getByDate(date) {
        return this.apodService.findByDate(date);
    }
    syncRange(start, end) {
        return this.apodService.syncRange(start, end);
    }
};
exports.ApodController = ApodController;
__decorate([
    (0, common_1.Get)("sync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApodController.prototype, "fetchAndStore", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ApodController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":date"),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApodController.prototype, "getByDate", null);
__decorate([
    (0, common_1.Get)('sync-range'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApodController.prototype, "syncRange", null);
exports.ApodController = ApodController = __decorate([
    (0, common_1.Controller)("apod"),
    __metadata("design:paramtypes", [apod_service_1.ApodService])
], ApodController);
//# sourceMappingURL=apod.controller.js.map