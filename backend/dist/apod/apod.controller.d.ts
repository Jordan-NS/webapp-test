import { ApodService } from "./apod.service";
export declare class ApodController {
    private readonly apodService;
    constructor(apodService: ApodService);
    fetchAndStore(): Promise<{
        id: string;
        title: string;
        url: string;
        explanation: string;
        date: string;
        mediaType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAll(date?: string, search?: string, page?: string, limit?: string): Promise<{
        id: string;
        title: string;
        url: string;
        explanation: string;
        date: string;
        mediaType: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getByDate(date: string): Promise<{
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
