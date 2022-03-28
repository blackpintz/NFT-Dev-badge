## NFT Badge Viewer.

### Short description

User A can post a job assignment on the app. User B can claim the job and send a link with the completed assignment. When User A confirms the work is completed, they will approve and user B will receive the payment for the assignment and an NFT. 

## Built With

- Solidity

- Nextjs

- Ethersjs

- Hardhat

## Live Demo

https://nft-badges.on.fleek.co/.

## Video recording

https://youtu.be/nMFhylYrIR8

## Directory Structure

- ```contract```: solidity contracts.
- ```pages``` and ```components```: frontend files.
- ```test```: test files

## Getting Started

## Prerequisites

- Install node.

## Set up

1. Clone the project.

2. Cd into the project directory.

3. Run ```npm install```

4. Create a ```.env``` file and paste your ```PRIVATE_KEY``` and ```PROJECT_ID```(project id from infura project).

5. Create a ```config.js``` file in the root directory and paste the following addresses after running ``` npx hardhat run .\scripts\deploy.js ---network (e.g rinkeby)```: ```nftaddress, jobPostAddress, metaAddress```. Remember to export them.

6. If you are using a local testnet, open another terminal and run ```npx hardhat node```. Do this before step 5.

7. Run ```npm run dev``` to open the app on ```localhost:300```.

## Tests

Run ```npx hardhat test```.