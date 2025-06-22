import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  const accessToken = 'mocked_token';
  const email = 'test@example.com';
  const password = 'password123';

  const mockAuthService = {
    signup: jest.fn().mockResolvedValue({ access_token: accessToken }),
    validateUser: jest.fn().mockResolvedValue({ id: 1, email: email }),
    login: jest.fn().mockResolvedValue({ access_token: accessToken }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return access_token on successful signup', async () => {
      const dto: SignupDto = {
        email,
        password,
        name: 'test user',
      };

      const result = await controller.signup(dto);
      expect(result).toEqual({ access_token: accessToken });
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should return access_token on successful login', async () => {
      const dto: LoginDto = {
        email,
        password,
      };

      const result = await controller.login(dto);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw if vallidateUser fails', async () => {
      mockAuthService.validateUser.mockRejectedValueOnce(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login({ email, password })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
