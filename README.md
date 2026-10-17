# Campus Lost and Found DApp

## Assignment details

| Field | Value |
|---|---|
| Student | Aryan Dhar |
| Registration number | 230905162 |
| Course | CSE4444 Blockchain Technology |
| Deployment network | Ganache local blockchain |
| Contract address | Add after deployment |

## Problem addressed

Lost property is commonly recorded in paper registers or informal messages, which makes ownership claims difficult to trace. This DApp stores found-item records and claim status on Ethereum so that each state-changing action is auditable. The finder controls approval and return actions, preventing unauthorised updates.

## Project structure

- `contracts/CampusLostAndFound.sol` - Solidity smart contract
- `frontend/index.html` - user interface
- `frontend/style.css` - user interface styling
- `frontend/app.js` - MetaMask and Ethers.js integration
- `test/TEST_PLAN.md` - required test cases

## Run with Ganache, Remix, and MetaMask

1. Start Ganache and create a local workspace. Note its RPC server, normally `http://127.0.0.1:7545`.
2. In MetaMask, add a custom network using Ganache's RPC URL and chain ID. Import a Ganache account using its private key for testing only.
3. Open Remix IDE, create `CampusLostAndFound.sol`, and paste the contract source from `contracts/`.
4. Compile with Solidity compiler version `0.8.20` or a compatible `0.8.x` version.
5. In Remix **Deploy & Run**, select **Injected Provider - MetaMask** and deploy the contract. Approve the transaction in MetaMask.
6. Copy the deployed contract address and paste it into the frontend after opening `frontend/index.html` with a local web server (for example, VS Code Live Server). Click **Load contract**.
7. Connect MetaMask, register an item, use another Ganache account to request a claim, then switch back to the finder account to mark the item returned.

## Tests

Follow [test/TEST_PLAN.md](test/TEST_PLAN.md). Keep screenshots of each relevant outcome. Update this file with the deployed address and actual transaction hashes after your live Ganache run.

## Submission evidence checklist

- [ ] Remix compiler shows successful compilation
- [ ] Remix/MetaMask shows contract deployment
- [ ] Frontend shows MetaMask connection
- [ ] Successful register or claim transaction
- [ ] Failed invalid or unauthorised transaction
- [ ] Frontend item list shows blockchain data
- [ ] README updated with deployed address and screenshots

## Security note

Do not upload private keys, seed phrases, passwords, or Ganache workspace files to GitHub.
