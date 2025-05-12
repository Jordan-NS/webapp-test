import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from "@nestjs/common";

import { FavoriteService } from "./favorite.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(req.user.id, createFavoriteDto);
  }

  @Delete(":apodId")
  remove(@Request() req, @Param("apodId") apodId: string) {
    return this.favoriteService.remove(req.user.id, apodId);
  }

  @Get()
  findUserFavorites(@Request() req) {
    return this.favoriteService.findUserFavorites(req.user.id);
  }
}
