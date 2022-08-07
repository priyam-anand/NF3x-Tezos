import Web3 from "web3";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

const providerOptions = {
    walletconnect: {
        package: WalletConnect, // required
        options: {
            infuraId: '25ca5cbdea4f4b2eb3c5c454608fead3' // required
        }
    }
}

const web3Modal = new Web3Modal({
    providerOptions, // required
    cacheProvider: true
});

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        const onLoad = async () => {
            if (web3Modal.cachedProvider) {
                const provider = await web3Modal.connect();
                const web3 = new Web3(provider);
                resolve(web3);
            }
            else {
                try {
                    const provider = await web3Modal.connect();
                    const web3 = new Web3(provider);
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
        };
        onLoad();
    });
};


const switchNetwork = async (web3) => {
    return new Promise((resolve, reject) => {
        const onLoad = async () => {
            try {
                await web3._provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x4' }],
                });
                resolve("Chain switched");
            } catch (e) {
                if (e.code === 4902) {
                    try {
                        await web3._provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x4',
                                    chainName: 'Rinkeby Test Network',
                                    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
                                },
                            ],
                        });
                        resolve("Chain switched");
                    } catch (addError) {
                        console.error(addError);
                        reject("Chain could not be switched");
                    }
                }
                console.error(e);
                reject("Chain could not be switched");
            }
        }
        onLoad();
    })
}

const logout = () => {
    web3Modal.clearCachedProvider();
}

const getPositionImage = () => {
    return 'https://i.ibb.co/hWZn3pP/Night-Light.png'
}

const getTezLogo = () => {
    return 'https://w7.pngwing.com/pngs/13/797/png-transparent-tezos-hd-logo-thumbnail.png'
}

export { getWeb3, switchNetwork, logout, getPositionImage, getTezLogo };