use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// QuantumOracle Program for Solana Devnet
/// Provides 9-second pulse feeds with 94-repository fidelity tracking
#[program]
pub mod quantum_oracle {
    use super::*;

    /// Initialize the quantum oracle
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.authority = ctx.accounts.authority.key();
        oracle.last_update_timestamp = Clock::get()?.unix_timestamp;
        oracle.pulse_count = 0;
        oracle.pulse_interval = 9; // 9 seconds
        Ok(())
    }

    /// Update pulse (automated or manual)
    pub fn update_pulse(
        ctx: Context<UpdatePulse>,
        data_hash: [u8; 32],
        fidelity_score: u8,
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        let clock = Clock::get()?;
        
        // Check if pulse interval has elapsed
        require!(
            clock.unix_timestamp - oracle.last_update_timestamp >= oracle.pulse_interval,
            OracleError::PulseIntervalNotReached
        );
        
        // Validate fidelity score
        require!(
            fidelity_score <= 94,
            OracleError::InvalidFidelityScore
        );
        
        // Update pulse data
        oracle.pulse_count += 1;
        oracle.last_update_timestamp = clock.unix_timestamp;
        oracle.last_data_hash = data_hash;
        oracle.last_fidelity_score = fidelity_score;
        
        emit!(PulseUpdated {
            pulse_id: oracle.pulse_count,
            timestamp: clock.unix_timestamp,
            data_hash,
            fidelity_score,
        });
        
        Ok(())
    }

    /// Manual pulse update (authority only)
    pub fn manual_pulse_update(
        ctx: Context<ManualUpdate>,
        data_hash: [u8; 32],
        fidelity_score: u8,
    ) -> Result<()> {
        require!(
            fidelity_score <= 94,
            OracleError::InvalidFidelityScore
        );
        
        let oracle = &mut ctx.accounts.oracle;
        let clock = Clock::get()?;
        
        oracle.pulse_count += 1;
        oracle.last_update_timestamp = clock.unix_timestamp;
        oracle.last_data_hash = data_hash;
        oracle.last_fidelity_score = fidelity_score;
        
        emit!(PulseUpdated {
            pulse_id: oracle.pulse_count,
            timestamp: clock.unix_timestamp,
            data_hash,
            fidelity_score,
        });
        
        Ok(())
    }

    /// Transfer authority
    pub fn transfer_authority(
        ctx: Context<TransferAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.authority = new_authority;
        
        emit!(AuthorityTransferred {
            old_authority: ctx.accounts.authority.key(),
            new_authority,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + OracleAccount::INIT_SPACE
    )]
    pub oracle: Account<'info, OracleAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePulse<'info> {
    #[account(mut)]
    pub oracle: Account<'info, OracleAccount>,
}

#[derive(Accounts)]
pub struct ManualUpdate<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub oracle: Account<'info, OracleAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferAuthority<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub oracle: Account<'info, OracleAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct OracleAccount {
    /// Authority pubkey
    pub authority: Pubkey,
    /// Last update timestamp
    pub last_update_timestamp: i64,
    /// Pulse interval in seconds
    pub pulse_interval: i64,
    /// Total pulse count
    pub pulse_count: u64,
    /// Last data hash
    pub last_data_hash: [u8; 32],
    /// Last fidelity score (out of 94)
    pub last_fidelity_score: u8,
}

impl OracleAccount {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 8 + 32 + 1;
}

#[event]
pub struct PulseUpdated {
    pub pulse_id: u64,
    pub timestamp: i64,
    pub data_hash: [u8; 32],
    pub fidelity_score: u8,
}

#[event]
pub struct AuthorityTransferred {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[error_code]
pub enum OracleError {
    #[msg("Pulse interval has not been reached yet")]
    PulseIntervalNotReached,
    #[msg("Fidelity score must be between 0 and 94")]
    InvalidFidelityScore,
}
