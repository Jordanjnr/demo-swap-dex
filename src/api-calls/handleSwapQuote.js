import axios from "axios";

export const fetchQuote = async (
  selectedFromToken,
  selectedToToken,
  fromAmount,
  fromDecimals,
  chainId,
  zeroxnetwork
) => {
  if (
    selectedFromToken !== null &&
    selectedToToken !== null &&
    fromAmount !== null &&
    fromDecimals !== null &&
    chainId !== null
  ) {
    const data = axios.get(
      `https://${zeroxnetwork}api.0x.org/swap/v1/quote?sellToken=${selectedFromToken}&buyToken=${selectedToToken}&sellAmount=${
        fromAmount * 10 ** fromDecimals
      }`
    );

    return data;
  }
};
