#[cfg(test)]
mod tests {
    use crate::{InvoiceIQContract, InvoiceIQContractClient};
    use soroban_sdk::{symbol_short, testutils::Address as _, token, Address, Env, String};

    #[test]
    fn test_complete_invoice_flow() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let vendor = Address::generate(&env);
        let client_addr = Address::generate(&env);

        // Register InvoiceIQ contract
        let contract_id = env.register(InvoiceIQContract, ());
        let contract_client = InvoiceIQContractClient::new(&env, &contract_id);

        // 1. Initialize with admin
        contract_client.init(&admin);
        assert_eq!(contract_client.get_admin(), admin);

        // 2. Setup a mock token (e.g. USDC)
        let token_admin = Address::generate(&env);
        let token_id = env.register_stellar_asset_contract_v2(token_admin.clone());
        let token_client = token::Client::new(&env, &token_id.address());
        let token_admin_client = token::StellarAssetClient::new(&env, &token_id.address());

        // Mint tokens to the client
        token_admin_client.mint(&client_addr, &10000);
        assert_eq!(token_client.balance(&client_addr), 10000);

        // 3. Create an invoice
        let id = String::from_str(&env, "INV-2024-001");
        let description = String::from_str(&env, "Decentralized Audit Services");
        let amount: i128 = 5000;
        let due_date = env.ledger().timestamp() + 604800; // 1 week later

        contract_client.create_invoice(
            &id,
            &vendor,
            &client_addr,
            &token_id.address(),
            &amount,
            &description,
            &due_date,
        );

        // Verify invoice was stored correctly
        let invoice = contract_client
            .get_invoice(&id)
            .expect("Invoice should exist");
        assert_eq!(invoice.vendor, vendor);
        assert_eq!(invoice.client, client_addr);
        assert_eq!(invoice.amount, amount);
        assert_eq!(invoice.status, symbol_short!("pending"));
        assert_eq!(contract_client.get_total_count(), 1);

        // 4. Pay the invoice
        contract_client.pay_invoice(&id, &client_addr);

        // Verify status and token transfer
        let invoice_paid = contract_client.get_invoice(&id).unwrap();
        assert_eq!(invoice_paid.status, symbol_short!("paid"));
        assert_eq!(token_client.balance(&vendor), 5000);
        assert_eq!(token_client.balance(&client_addr), 5000);
    }

    #[test]
    #[should_panic(expected = "Invoice ID already exists")]
    fn test_duplicate_invoice_prevention() {
        let env = Env::default();
        env.mock_all_auths();

        let vendor = Address::generate(&env);
        let client_addr = Address::generate(&env);
        let token_id = Address::generate(&env);

        let contract_id = env.register(InvoiceIQContract, ());
        let contract_client = InvoiceIQContractClient::new(&env, &contract_id);

        let id = String::from_str(&env, "DUPLICATE");
        contract_client.create_invoice(
            &id,
            &vendor,
            &client_addr,
            &token_id,
            &100,
            &String::from_str(&env, "One"),
            &0,
        );
        contract_client.create_invoice(
            &id,
            &vendor,
            &client_addr,
            &token_id,
            &200,
            &String::from_str(&env, "Two"),
            &0,
        );
    }

    #[test]
    fn test_cancel_invoice() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let vendor = Address::generate(&env);
        let client_addr = Address::generate(&env);
        let token_id = Address::generate(&env);

        let contract_id = env.register(InvoiceIQContract, ());
        let contract_client = InvoiceIQContractClient::new(&env, &contract_id);
        contract_client.init(&admin);

        let id = String::from_str(&env, "CANCEL-ME");
        contract_client.create_invoice(
            &id,
            &vendor,
            &client_addr,
            &token_id,
            &100,
            &String::from_str(&env, "Test"),
            &0,
        );

        contract_client.cancel_invoice(&id);

        let invoice = contract_client.get_invoice(&id).unwrap();
        assert_eq!(invoice.status, symbol_short!("canceled"));
    }
}
