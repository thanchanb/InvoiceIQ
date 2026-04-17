#![no_std]
mod test;
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec, Map, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Invoice(String), // Track invoice by unique ID (String)
    TotalVolume,     // Track total volume of payments handled
}

#[contracttype]
#[derive(Clone)]
pub struct InvoiceData {
    pub client: Address,
    pub amount: u32,
    pub description: String,
    pub status: Symbol, // e.g., "created", "paid", "cancelled"
}

#[contract]
pub struct InvoiceContract;

#[contractimpl]
impl InvoiceContract {
    /// Creates a new persistent invoice entry in the ledger
    pub fn create_invoice(env: Env, id: String, client: Address, amount: u32, description: String) {
        // Ensure the invoice doesn't already exist to prevent overwrites
        let key = DataKey::Invoice(id.clone());
        if env.storage().persistent().has(&key) {
            panic!("Invoice ID already exists");
        }

        let data = InvoiceData {
            client,
            amount,
            description,
            status: symbol_short!("created"),
        };

        // Store the invoice data persistently
        env.storage().persistent().set(&key, &data);

        // Update total volume placeholder logic
        let volume_key = DataKey::TotalVolume;
        let mut total: u32 = env.storage().persistent().get(&volume_key).unwrap_or(0);
        total += amount;
        env.storage().persistent().set(&volume_key, &total);

        // Publish an event for indexing
        env.events().publish((symbol_short!("inv_new"), id), (amount, data.status));
    }

    /// Marks an invoice as paid
    pub fn mark_paid(env: Env, id: String) {
        let key = DataKey::Invoice(id.clone());
        let mut data: InvoiceData = env.storage().persistent().get(&key).expect("Invoice not found");
        
        data.status = symbol_short!("paid");
        env.storage().persistent().set(&key, &data);

        env.events().publish((symbol_short!("inv_paid"), id), data.amount);
    }

    /// Retrieves invoice details
    pub fn get_invoice(env: Env, id: String) -> Option<InvoiceData> {
        let key = DataKey::Invoice(id);
        env.storage().persistent().get(&key)
    }

    /// Returns the total volume handled by the contract
    pub fn get_total_volume(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::TotalVolume).unwrap_or(0)
    }
}

