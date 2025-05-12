import { IsNotEmpty, IsString } from "class-validator";

export class CreateApodDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  url: string;
  
  @IsNotEmpty()
  @IsString()
  explanation: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  media_type: string;
}