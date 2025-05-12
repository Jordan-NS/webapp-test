import { HttpService } from "@nestjs/axios";
import { PrismaService } from "../prisma/prisma.service";
export declare class ApodService {
    private prisma;
    private http;
    constructor(prisma: PrismaService, http: HttpService);
    private fetchFromNasa;
    fetchAndSaveApod(): Promise<any>;
    private saveApod;
    findAll(date?: string, search?: string, page?: number, limit?: number): Promise<{
        id: string;
        title: string;
        url: string;
        explanation: string;
        date: string;
        mediaType: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByDate(date: string): Promise<{
        id: string;
        title: string;
        url: string;
        explanation: string;
        date: string;
        mediaType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    syncRange(start: string, end: string): Promise<{
        saved: any[];
        errors: any[];
    }>;
}
