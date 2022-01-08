
export const networks = {
    GE: {
      chainId: `0x${Number(8996).toString(16)}`,
      chainName: "GE Dev Network",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: ["https://rpc.grassecon.net/"],
    },
    rinkeby: {
      chainId: `0x${Number(4).toString(16)}`,
      chainName: "Rinkeby Test Network",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: [
        "https://rinkeby.infura.io/v3/7334a152ff8749809c2bb4a1c5ac5cf2",
      ],
      blockExplorerUrls: ["https://rinkeby.etherscan.io"]
    }
  };