<img width="2108" alt="banner" src="https://user-images.githubusercontent.com/53532851/184135640-28539925-1b06-47e8-8aa2-b2b241098336.png">

## NF3 : A multi asset marketplace to swap fungible & non-fungible tokens (NFTS).                                                      
#### Facilitating peer-to-peer bartering & financing between sellers and buyers.

NF3 is a trading platform dedicated to instant purchases and financing of NFTs bought over the counter various functionalities like listing their non-fungible tokens in exchange for fungible tokens, non-fungible tokens, non-fungible tokens plus fungible tokens, reserve options etc. Buyers can directly swap, create an offer or reserve an NFT and lock in payment parameters & receive an NFT reservation contract in return, settle the balance later and complete the swap. To make the platform more dynamic for buyers and sellers we also allow selling, purchasing and making offers on reserved Items. Users can swap with confidence knowing only approved NFT collections & tokens are permitted to be swapped on the exchange. Buyers can also make NFT collection swap offers with both fungible and/or non-fungible tokens. Or, offer a reserve and swap later contract to all NFTs in a collection.

In depth technical details for the platform can be found [**here**](https://docs.google.com/document/d/1vOKMy10RoDvYj4eVWqgM9PkCYb639FFh1SiUOcswziQ/edit?usp=sharing)

[![Website Link](https://img.shields.io/badge/Website-Link-FF0083?style=for-the-badge&logo=web&logoColor=white)](https://nf3x-tez.netlify.app/)

## 🔧 Built With
- Tezos
- SmartPy
- Taquito
- Beacon Wallet
- tzkt.io
- ReactJS
- Material-UI

## 🚀 Deployment

All the smart contracts for NF3x platform are deployed on `jakartanet` testnet

- Admin address : `tz1g7Tv9nnr55Hz9AoAwEiAJ63LNonKNzMoj`

- Public facing contracts
  - market : `KT1KRpubnpGnxJ3iuvDwgkqiK4pAmuYdhR3K`
  - getters : `KT18yNEL7HrG17zBsHLf6CFxy2kTeDQaQAAm`

- Storage contracts
  - itemStorage : `KT1UrpC6YWPY6sAoV3sq9P8b4ZTrHJn89hFc`
  - detailStorage : `KT1UqKHeqmRB2nKcJzcRoK3MmdZdt5X1r1Rm`
  - offerStorage : `KT1XtkgyKoBRmTiw6YwQEPzuADuVQmfB39iZ`

- Core contracts
  - whitelist : `KT1JoBi2i8e8m2uksPbmTo5NGs53nQT5oyMB`
  - listing : `KT1MY9hexJH65XXUse735wxY3CfW1xg5zdVv`
  - vault : `KT1CGX75cgk3VEArBZifakhTzKsynEq2WdaL`
  - swap : `KT1Fuh78A3bXsCKQBud68dL483e5qrC1HfrU`
  - reserve : `KT1DEGAt7fNKt77zpAqdRJpUbHm5CDRKgCbt`
  - reserveUtils : `KT1NRgfeoKsidyVHgUdzbCPZvhEAvaKj58CY`
  - positionToken : `KT1PjNEzCq2mCUUdify7iCbDFyvNTe6b1sdQ`

Sample NFT collections operable on the platoform

NOTE : These NFTs are minted using the same token metadata as original NFTs on mainnet, hence they look exactly the same. It must be used only for testing purposes on this platoform.  
- Ottez : `KT1C65iQ9MMGW51vynEL1rZbBTyY6vJw1dxH`
- Tezzardz : `KT1JuGx7X8bvarK6DVjx6zk3n7G2fjnaB8WX`
- Neonz : `KT1Wu3pDzDddW2nnectSiSWjuxoeWaChDR4s`
- Ziggurats : `KT1RD5z5BgQnHirHbW2ic5FM9WwU4t4ivQC2`
- Prjktneon : `KT1C3refgX86Xwu637VvoK9CoezPghoSdQ9s`
- GOGOs : `KT1JLRYdGwPmRRpKTrjThGxEcTE4DJnpyXWQ`


# ⚡️ Quick Start

##### `Run tests`

-   cd src
-   Use https://smartpy.io/ide to create individual contracts for each file in this folder
-   cd ../mocks
-   use these files as test NFT and FT contracts and create their own individual contracts following the naming convention used in test files
-   cd ../tests
-   every file in this folder is an extensive test file for their respective use cases, copy paste in smartpy ide as independant contract and run
-   Details of the entire tests suit can be found [**here**](https://docs.google.com/document/d/141I0AZj9HZwbpGhcaKmDdEXhe4gPTlnE_hUvZTQqD4o/edit?usp=sharing)

##### `Deploy smart contracts`

-   cd contracts/origination
-   create a new file called `.secret` and add your private key here
-   node nf3xDeployer.js

##### `Install client dependencies`

-   cd client
-   npm install
-   npm start

##### `Build for production`

-   cd client
-   npm run build

Check in browser on http://localhost:3000/

## 🔮 Future Scope of Improvement
- A detailed document with suggested future improvements can be found [here](https://docs.google.com/document/d/1C07UPDcyRunFrmA5q5dTR4L4JWTXOEDIHjTPuRjzTXU/edit?usp=sharing)


## 🥂 Team

<table>
  <tbody><tr>
    <td align="center"><a href="https://github.com/priyam-anand"><img src="https://avatars.githubusercontent.com/priyam-anand" width="100px;"><br><sub><b>Priyam Anand</b></sub></a><br> Developer 💻</td> </a>
    </td>
    <td align="center"><a href="https://github.com/SHITIZ-AGGARWAL"><img src="https://avatars.githubusercontent.com/SHITIZ-AGGARWAL" width="100px;"><br><sub><b>Shitiz Aggarwal</b></sub></a><br>Designer 🖋</td> </a></td>
  </tbody></tr>
</table>
