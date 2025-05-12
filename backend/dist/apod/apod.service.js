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
exports.ApodService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const prisma_service_1 = require("../prisma/prisma.service");
let ApodService = class ApodService {
    constructor(prisma, http) {
        this.prisma = prisma;
        this.http = http;
    }
    async fetchFromNasa(date) {
        const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}${date ? `&date=${date}` : ''}`;
        const { data } = await this.http.axiosRef.get(url);
        if (data.media_type === 'video') {
            return null;
        }
        return data;
    }
    async fetchAndSaveApod() {
        const data = await this.fetchFromNasa();
        if (!data)
            return null;
        return this.saveApod(data);
    }
    async saveApod(data) {
        return this.prisma.apod.upsert({
            where: { date: data.date },
            update: {},
            create: {
                title: data.title,
                url: data.url,
                explanation: data.explanation,
                date: data.date,
                mediaType: data.media_type,
            },
        });
    }
    async findAll(date, search, page = 1, limit = 12) {
        if (date) {
            try {
                const nasaData = await this.fetchFromNasa(date);
                if (nasaData) {
                    await this.saveApod(nasaData);
                }
            }
            catch (error) {
                console.error('Erro ao buscar da NASA:', error);
            }
        }
        const where = {
            mediaType: 'image'
        };
        if (date) {
            where.date = date;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { explanation: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.apod.findMany({
            where,
            orderBy: {
                date: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findByDate(date) {
        try {
            const nasaData = await this.fetchFromNasa(date);
            if (nasaData) {
                return await this.saveApod(nasaData);
            }
        }
        catch (error) {
            console.error('Erro ao buscar da NASA:', error);
        }
        return this.prisma.apod.findFirst({
            where: {
                date,
                mediaType: 'image'
            },
        });
    }
    async syncRange(start, end) {
        const results = [];
        const errors = [];
        const startDate = new Date(start);
        const endDate = new Date(end);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().slice(0, 10);
            try {
                const data = await this.fetchFromNasa(dateStr);
                if (data) {
                    await this.saveApod(data);
                    results.push(dateStr);
                }
            }
            catch (err) {
                errors.push({ date: dateStr, error: err.message });
            }
        }
        return { saved: results, errors };
    }
};
exports.ApodService = ApodService;
exports.ApodService = ApodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], ApodService);
//# sourceMappingURL=apod.service.js.map