import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMockUser,
  DEFAULT_TEST_EMAIL,
  DEFAULT_TEST_NAME,
  DEFAULT_TEST_PASSWORD,
} from '../../test/utils';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Partial<Repository<User>>;

  const mockUser = createMockUser();

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail(DEFAULT_TEST_EMAIL);
      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: DEFAULT_TEST_EMAIL },
      });
    });

    it('should return null when user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(mockUser);

      const userInput = {
        email: DEFAULT_TEST_EMAIL,
        password: DEFAULT_TEST_PASSWORD,
        name: DEFAULT_TEST_NAME,
      };

      const result = await service.create(userInput);

      expect(result).toEqual(mockUser);
      expect(repo.create).toHaveBeenCalledWith(userInput);
      expect(repo.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
