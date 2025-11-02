import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/common/service/token.service';
import { AuthenticationGuard } from '../authentication/authentication.guard';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let tokenService: TokenService;
  let reflector: Reflector;

  beforeEach(() => {
    // Mock TokenService methods
    tokenService = {
      decodedToken: jest.fn().mockResolvedValue({
        user: { id: '123', name: 'Test User' },
        decoded: { sub: '123' },
      }),
    } as any;

    // Simple mock of Reflector
    reflector = new Reflector();

    // Pass mocks into constructor
    guard = new AuthenticationGuard(tokenService, reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
