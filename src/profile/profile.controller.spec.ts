import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(() => {
    controller = new ProfileController();
  });

  it('should return user payload from request', () => {
    const mockRequest = {
      user: {
        sub: 1,
        email: 'test@exsample.com',
      },
    };

    const result = controller.getProfile(mockRequest as { user: JwtPayload });
    expect(result).toEqual({
      sub: 1,
      email: 'test@exsample.com',
    });
  });
});
