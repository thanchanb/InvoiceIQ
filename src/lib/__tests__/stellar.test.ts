import { getActiveNetwork, generateStellarPaymentURL } from '../stellar';

describe('Stellar Integration Utility Unit Tests', () => {
    test('getActiveNetwork defaults to TESTNET in SSR environment', () => {
        const network = getActiveNetwork();
        expect(network).toBe('TESTNET');
    });

    test('generateStellarPaymentURL generates correct mainnet explorer URL', () => {
        const address = 'GAFB7IYPCYZCODQBB5BR5JO45JC4PPVLARUAXQSFHWTLH2KMHPWJ36GD';
        const amount = '58.25';
        const memo = 'INV-041';
        
        const url = generateStellarPaymentURL(address, amount, memo);
        expect(url).toContain('destination=' + address);
        expect(url).toContain('amount=' + amount);
        expect(url).toContain('memo=' + memo);
    });
});
