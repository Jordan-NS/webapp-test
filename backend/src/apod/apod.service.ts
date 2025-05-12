import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CreateApodDto } from "./dto/create-apod.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ApodService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService
  ) {}

  private async fetchFromNasa(date?: string) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}${date ? `&date=${date}` : ''}`;
    const { data } = await this.http.axiosRef.get(url);
    
    // Se for vídeo, retorna null
    if (data.media_type === 'video') {
      return null;
    }
    
    return data;
  }

  async fetchAndSaveApod(): Promise<any> {
    const data = await this.fetchFromNasa();
    if (!data) return null;
    return this.saveApod(data);
  }

  private async saveApod(data: any) {
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

  async findAll(date?: string, search?: string, page: number = 1, limit: number = 12) {
    if (date) {
      try {
        const nasaData = await this.fetchFromNasa(date);
        if (nasaData) {
          await this.saveApod(nasaData);
        }
      } catch (error) {
        console.error('Erro ao buscar da NASA:', error);
      }
    }

    const where: Prisma.ApodWhereInput = {
      mediaType: 'image' // Filtra apenas imagens
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

  async findByDate(date: string) {
    try {
      const nasaData = await this.fetchFromNasa(date);
      if (nasaData) {
        return await this.saveApod(nasaData);
      }
    } catch (error) {
      console.error('Erro ao buscar da NASA:', error);
    }
    
    // Se não encontrou na NASA ou é vídeo, busca do banco local
    return this.prisma.apod.findFirst({
      where: { 
        date,
        mediaType: 'image'
      },
    });
  }

  /**
   * Sincroniza imagens da NASA APOD em lote, dado um intervalo de datas (YYYY-MM-DD).
   * Salva apenas imagens (ignora vídeos).
   * Retorna um array com as datas salvas e as que deram erro.
   */
  async syncRange(start: string, end: string) {
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
      } catch (err) {
        errors.push({ date: dateStr, error: err.message });
      }
    }
    return { saved: results, errors };
  }
}