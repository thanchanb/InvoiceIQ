import { getActiveNetwork, getServer } from '../stellar';

describe('Verification & Network Tests', () => {
  it('should be capable of running checks on the network', () => {
    // Tests are used to verify the application's network configuration
    expect(getActiveNetwork).toBeDefined();
    expect(getServer).toBeDefined();
  });
});
