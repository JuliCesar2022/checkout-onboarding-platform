import { ApiEndpoint, PublicEndpoint, StrictEndpoint, NoThrottle } from './throttle.decorators';

describe('Throttle Decorators', () => {
  it('should define PublicEndpoint decorator', () => {
    expect(PublicEndpoint).toBeDefined();
    const decorator = PublicEndpoint();
    expect(typeof decorator).toBe('function');
  });

  it('should define ApiEndpoint decorator', () => {
    expect(ApiEndpoint).toBeDefined();
    const decorator = ApiEndpoint();
    expect(typeof decorator).toBe('function');
  });

  it('should define StrictEndpoint decorator', () => {
    expect(StrictEndpoint).toBeDefined();
    const decorator = StrictEndpoint();
    expect(typeof decorator).toBe('function');
  });

  it('should define NoThrottle decorator', () => {
    expect(NoThrottle).toBeDefined();
    const decorator = NoThrottle();
    expect(typeof decorator).toBe('function');
  });
});
