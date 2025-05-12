import { IsNotEmpty, IsString } from "class-validator";

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  apodId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  explanation: string;
}