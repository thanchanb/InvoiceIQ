#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _}, Address, Env, String, symbol_short};

    #[test]
    fn test_create_and_get_invoice() {
        let env = Env::default();
        let contract_id = env.register_contract(None, InvoiceContract);
        let client = InvoiceContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let id = String::from_str(&env, "INV-001");
        let description = String::from_str(&env, "Consulting Services");
        let amount = 1000;

        client.create_invoice(&id, &user, &amount, &description);

        let invoice = client.get_invoice(&id).unwrap();
        assert_eq!(invoice.client, user);
        assert_eq!(invoice.amount, amount);
        assert_eq!(invoice.description, description);
        assert_eq!(invoice.status, symbol_short!("created"));

        assert_eq!(client.get_total_volume(), 1000);
    }

    #[test]
    fn test_mark_paid() {
        let env = Env::default();
        let contract_id = env.register_contract(None, InvoiceContract);
        let client = InvoiceContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let id = String::from_str(&env, "INV-002");
        client.create_invoice(&id, &user, &500, &String::from_str(&env, "Test"));

        client.mark_paid(&id);

        let invoice = client.get_invoice(&id).unwrap();
        assert_eq!(invoice.status, symbol_short!("paid"));
    }

    #[test]
    #[should_panic(expected = "Invoice ID already exists")]
    fn test_duplicate_invoice() {
        let env = Env::default();
        let contract_id = env.register_contract(None, InvoiceContract);
        let client = InvoiceContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let id = String::from_str(&env, "INV-DUP");
        client.create_invoice(&id, &user, &100, &String::from_str(&env, "First"));
        client.create_invoice(&id, &user, &200, &String::from_str(&env, "Second"));
    }
}
