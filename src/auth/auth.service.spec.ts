import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { SignupDto } from './auth.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked_token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser(mockUser.email, mockUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser(mockUser.email, mockUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user if credentials are valid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        mockUser.email,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('signup', () => {
    it('should throw ConflictException if email already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.signup({
          email: mockUser.email,
          password: mockUser.password,
          name: mockUser.name,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return token if email is new', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockReturnValue('hashedpassword');
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const dto: SignupDto = {
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
      };

      const result = await service.signup(dto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(usersService.create).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
        name: dto.name,
      });
    });
  });
});
