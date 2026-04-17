#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct InvoiceContract;

#[contractimpl]
impl InvoiceContract {
    /// Creates a new immutable invoice reference pattern for tracking payments
    pub fn create_invoice(env: Env, to: Symbol, amount: u32) -> Vec<Symbol> {
        // Just a simple demonstrative contract that stores an event log effectively
        // InvoiceIQ relies primarily on Fee Bump gasless transactions and frontend UI
        vec![&env, symbol_short!("Created"), to]
    }
}
