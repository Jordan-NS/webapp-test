import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
 
  async register(data: RegisterDto) { 
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });
    const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { 
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { 
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
} 