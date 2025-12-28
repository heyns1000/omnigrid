# HotStack Deployment System

Rebuilt from Claude conversation data.

## Features
- 180-second deployment cycle
- Cloudflare Workers integration
- R2 storage
- Automatic DNS configuration

## Usage

```python
from deployment_engine import HotStackDeployer

deployer = HotStackDeployer()
result = deployer.deploy('./my-project', {
    'domain': 'example.com'
})
```

## Configuration

Set environment variables:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
