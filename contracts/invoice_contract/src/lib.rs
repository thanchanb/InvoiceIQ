#![no_std]
mod test;

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Invoice(String),
    InvoiceCount,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceData {
    pub vendor: Address,
    pub client: Address,
    pub amount: i128,
    pub token: Address, // The token address used for payment (e.g. XLM or USDC)
    pub description: String,
    pub status: Symbol, // pending, paid, cancelled
    pub due_date: u64,
    pub created_at: u64,
}

#[contract]
pub struct InvoiceIQContract;

#[contractimpl]
impl InvoiceIQContract {
    /// Initializes the contract with an admin address
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Creates a new invoice. Only callable by the vendor.
    #[allow(clippy::too_many_arguments)]
    pub fn create_invoice(
        env: Env,
        id: String,
        vendor: Address,
        client: Address,
        token_addr: Address,
        amount: i128,
        description: String,
        due_date: u64,
    ) {
        vendor.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let key = DataKey::Invoice(id.clone());
        if env.storage().persistent().has(&key) {
            panic!("Invoice ID already exists");
        }

        let invoice = InvoiceData {
            vendor: vendor.clone(),
            client: client.clone(),
            token: token_addr,
            amount,
            description,
            status: symbol_short!("pending"),
            due_date,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &invoice);

        // Increment invoice count
        let count_key = DataKey::InvoiceCount;
        let count: u32 = env.storage().instance().get(&count_key).unwrap_or(0);
        env.storage().instance().set(&count_key, &(count + 1));

        // Publish event
        env.events().publish(
            (symbol_short!("invoice"), symbol_short!("created"), id),
            (vendor, client, amount),
        );
    }

    /// Payments for an invoice. Transfers tokens from client to vendor using Soroban Token interface.
    pub fn pay_invoice(env: Env, id: String, payer: Address) {
        payer.require_auth();

        let key = DataKey::Invoice(id.clone());
        let mut invoice: InvoiceData = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Invoice not found");

        if invoice.status != symbol_short!("pending") {
            panic!("Invoice is not in pending status");
        }

        if payer != invoice.client {
            panic!("Only the client can pay this invoice");
        }

        // Perform the token transfer
        let token_client = token::Client::new(&env, &invoice.token);
        token_client.transfer(&payer, &invoice.vendor, &invoice.amount);

        // Update status
        invoice.status = symbol_short!("paid");
        env.storage().persistent().set(&key, &invoice);

        // Publish event
        env.events()
            .publish((symbol_short!("invoice"), symbol_short!("paid"), id), payer);
    }

    /// Cancels an invoice. Only the vendor can cancel.
    pub fn cancel_invoice(env: Env, id: String) {
        let key = DataKey::Invoice(id.clone());
        let mut invoice: InvoiceData = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Invoice not found");

        // Require auth from vendor
        invoice.vendor.require_auth();

        if invoice.status != symbol_short!("pending") {
            panic!("Cannot cancel a non-pending invoice");
        }

        invoice.status = symbol_short!("canceled");
        env.storage().persistent().set(&key, &invoice);

        env.events().publish(
            (symbol_short!("invoice"), symbol_short!("canceled"), id),
            (),
        );
    }

    /// Fetches invoice details
    pub fn get_invoice(env: Env, id: String) -> Option<InvoiceData> {
        env.storage().persistent().get(&DataKey::Invoice(id))
    }

    /// Returns the total number of invoices created
    pub fn get_total_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::InvoiceCount)
            .unwrap_or(0)
    }

    /// Returns the admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized")
    }
}
