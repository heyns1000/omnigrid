# VaultMesh Payment System

Multi-provider payment gateway supporting PayPal, PayFast, and Stripe.

## Features
- Unified payment API
- Multiple currency support
- Provider failover
- Transaction logging

## Usage

```python
from payment_gateway import VaultMeshGateway

gateway = VaultMeshGateway()
result = gateway.process_payment(
    amount=29.99,
    currency='USD',
    provider='paypal'
)
```
