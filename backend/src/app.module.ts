import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ApodModule } from "./apod/apod.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { FavoriteModule } from "./favorite/favorite.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ApodModule,
    FavoriteModule,
  ],
})
export class AppModule {}
