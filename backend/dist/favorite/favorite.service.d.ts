import { PrismaService } from "../prisma/prisma.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
export declare class FavoriteService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateFavoriteDto): Promise<{
        id: string;
        userId: string;
        apodId: string;
        title: string;
        date: string;
        url: string;
        explanation: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, apodId: string): Promise<{
        id: string;
        userId: string;
        apodId: string;
        title: string;
        date: string;
        url: string;
        explanation: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findUserFavorites(userId: string): Promise<{
        id: string;
        userId: string;
        apodId: string;
        title: string;
        date: string;
        url: string;
        explanation: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
