import addresses from "../addressesByChainId";

export default [
  {
    name: "AVAXOracle",
    id: 3,
    contractChain: "0x539",
    address: "0x0824545b22Dd6dC644C8b66d7923e613816Ff63a",
    abi: [
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "get",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "multiply", type: "address" },
          { internalType: "address", name: "divide", type: "address" },
          { internalType: "uint256", name: "decimals", type: "uint256" },
        ],
        name: "getDataParameter",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peek",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peekSpot",
        outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  },
  {
    name: "WXTOracle",
    id: 4,
    contractChain: "0xa869",
    address: addresses["0xa869"].WXTOracle,
    abi: [
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "get",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "multiply", type: "address" },
          { internalType: "address", name: "divide", type: "address" },
          { internalType: "uint256", name: "decimals", type: "uint256" },
        ],
        name: "getDataParameter",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peek",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peekSpot",
        outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  },
];
