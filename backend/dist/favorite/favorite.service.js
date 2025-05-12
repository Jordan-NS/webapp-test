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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoriteService = class FavoriteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const alreadyFavorited = await this.prisma.favorite.findFirst({
            where: {
                userId,
                apodId: dto.apodId,
            },
        });
        if (alreadyFavorited) {
            return alreadyFavorited;
        }
        return this.prisma.favorite.create({
            data: {
                userId,
                apodId: dto.apodId,
                title: dto.title,
                date: dto.date,
                url: dto.url,
                explanation: dto.explanation,
            },
        });
    }
    async remove(userId, apodId) {
        const favorite = await this.prisma.favorite.findFirst({
            where: {
                apodId,
                userId
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException("Favorito não encontrado");
        }
        return this.prisma.favorite.delete({ where: { id: favorite.id } });
    }
    async findUserFavorites(userId) {
        return this.prisma.favorite.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map