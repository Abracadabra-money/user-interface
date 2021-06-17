import axios from "axios";
import Web3 from "web3";
const web3 = new Web3();

export const fromWei = (value, weiFormat) => {
  return web3.utils.fromWei(value, weiFormat);
};

export const toWei = (value, weiFormat) => {
  return web3.utils.toWei(value, weiFormat);
};

export const BigInt = (value) => {
  return web3.utils.toBN(value);
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const tokenPrices = async (tokens) => {
  const prices = {};

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd"
    );
    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("weth")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd"
    );
    prices["weth"] = data.weth.usd;
  }

  if (tokens.includes("sushi")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd"
    );
    prices["sushi"] = data.sushi.usd;
  }

  if (tokens.includes("ice")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ice-token&vs_currencies=usd"
    );

    prices["ice"] = data["ice-token"].usd;
  }

  if (tokens.includes("spell")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=spell-token&vs_currencies=usd"
    );

    prices["spell"] = data["spell-token"].usd;
  }

  if (tokens.includes("staker")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ellipsis&vs_currencies=usd"
    );

    prices["staker"] = data.ellipsis.usd;
  }

  return prices;
};
