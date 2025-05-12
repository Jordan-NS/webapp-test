import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFavoriteDto) {
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
        user: { connect: { id: userId } },
        apod: { connect: { id: dto.apodId } }
      },
      include: {
        apod: true
      }
    });
  }

  async remove(userId: string, apodId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        apodId,
        userId
      },
    });

    if (!favorite) {
      throw new NotFoundException("Favorito não encontrado");
    }

    return this.prisma.favorite.delete({ where: { id: favorite.id } });
  }

  async findUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}