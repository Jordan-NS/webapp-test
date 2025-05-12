import { FavoriteService } from "./favorite.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    create(req: any, createFavoriteDto: CreateFavoriteDto): Promise<{
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
    remove(req: any, apodId: string): Promise<{
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
    findUserFavorites(req: any): Promise<{
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
