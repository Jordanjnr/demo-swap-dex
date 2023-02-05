import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { SettingsIcon } from "@chakra-ui/icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { polygon } from "../tokens/polygon";
import { fetchQuote } from "../api-calls/handleSwapQuote";
import { contractAbi } from "../tokens/abi";
const Dex = () => {
  //Transaction sending parameters
  const colorMode = useColorMode();
  const [hoverColor, setHoverColor] = useState("");
  const [chainId, setChainId] = useState(137);
  const [zeroxNetwork, setZeroxNetwork] = useState("polygon.");
  const [response, setResponse] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [approvedData, setApprovedData] = useState(null);
  const [oxParams, setOxParams] = useState(null);
  const [swapData, setSwapData] = useState(null);
  const [fromTokenSearch, setFromTokenSearch] = useState("");
  const [toTokenSearch, setToTokenSearch] = useState("");
  const [selectedToToken, setSelectedToToken] = useState(
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  );
  const [selectedImage, setSelectedImage] = useState(
    "https://elk.finance/tokens/logos/matic/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/logo.png"
  );
  const [selectedFromName, setselectedFromName] = useState("WMATIC");
  const [selectedToImage, setSelectedToImage] = useState(
    "https://elk.finance/tokens/logos/matic/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png"
  );
  const [selectedToName, setselectedToName] = useState("USDC");
  const [selectedFromToken, setSelectedFromToken] = useState(
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
  );
  const {
    isOpen: isFromTokenOpen,
    onOpen: onFromTokenOpen,
    onClose: onFromTokenClose,
  } = useDisclosure();

  const [fromDecimals, setFromDecimals] = useState(18);
  const [toDecimals, setToDecimals] = useState(6);

  const {
    isOpen: isToTokenOpen,
    onOpen: onToTokenOpen,
    onClose: onToTokenClose,
  } = useDisclosure();

  const [fromAmount, setFromAmount] = useState(1);

  useEffect(() => {
    const provider =
      window.ethereum && new ethers.providers.Web3Provider(window.ethereum);
    const connect = async () => {
      let accounts = await provider?.send("eth_requestAccounts", []);
      let account = accounts[0];
      setUserAddress(account);
    };
    connect();
  }, []);

  const fetchSwapParams = async () => {
    const reply = await fetchQuote(
      selectedFromToken,
      selectedToToken,
      fromAmount,
      fromDecimals,
      chainId,
      zeroxNetwork
    );
    setResponse(reply?.data);

    setOxParams({
      txData: reply?.data?.data,
      to: reply?.data?.to,
      value: reply?.data?.value,
      gasLimit: reply?.data?.gas,
      gasPrice: reply?.data?.gasPrice,
      allowanceTarget: reply?.data?.allowanceTarget,
    });
  };

  useEffect(() => {
    fetchSwapParams();
  }, [selectedFromName, selectedToToken, zeroxNetwork, fromAmount]);

  const approve0x = async () => {
    const provider =
      window.ethereum && new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider?.getSigner();
    const contract = new ethers.Contract(
      selectedFromToken,
      contractAbi,
      signer
    );
    const amount = String(fromAmount * 10 ** fromDecimals);
    const gasPrice = await provider.getGasPrice();
    const gasPriceInWei = ethers.BigNumber.from(gasPrice.toString());
    const lowGasPrice = gasPriceInWei.mul(2);
    const gas = await contract.estimateGas.approve(
      oxParams?.allowanceTarget,
      amount,
      {
        gasPrice: lowGasPrice,
      }
    );
    contract
      .approve(oxParams?.allowanceTarget, amount, {
        gasPrice: lowGasPrice,
        gasLimit: gas,
      })
      .then((tx) => {
        setApprovedData(tx);
      })
      .catch((error) => {});
  };

  const oxSwappingParams = {
    from: String(userAddress),
    to: String(oxParams?.to),
    value: oxParams?.value,
    data: oxParams?.txData,
    gasLimit: oxParams?.gasLimit,
    gasPrice: oxParams?.gasPrice,
  };

  const send0xTransaction = async () => {
    const provider =
      window.ethereum && new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider?.getSigner();
    const txstat = await signer.sendTransaction(oxSwappingParams).then((tx) => {
      setSwapData(tx);
    });
    /*     console.log(txstat); */
  };
  console.log(
    selectedFromToken,
    selectedToToken,
    fromAmount,
    fromDecimals,
    chainId,
    zeroxNetwork
  );

  useEffect(() => {
    if (colorMode.colorMode === "dark") {
      setHoverColor("black");
    } else if (colorMode.colorMode === "light") {
      setHoverColor("#f7fafe");
    }
  }, [colorMode]);

  return (
    <>
      <Flex flexDir="column" justifyContent="space-between">
        <Flex justifyContent="space-between" w="100%">
          <Flex alignItems="flex-start" flexDir="column">
            <Text fontSize="24px" fontWeight="700">
              Swap
            </Text>
            <Text fontSize="14px" color="#969696" fontWeight="500">
              Trade tokens in an instant
            </Text>
          </Flex>
          <Box>
            <SettingsIcon />
          </Box>
        </Flex>

        <Box mt="30px">
          <Flex flexDir="column">
            <Flex>
              <Box>
                {" "}
                <Flex
                  alignItems="center"
                  _hover={{ cursor: "pointer" }}
                  onClick={onFromTokenOpen}
                >
                  <Image
                    src={selectedImage}
                    boxSize="20px"
                    borderRadius="300px"
                  />
                  <Box pl="3px" fontWeight="700" fontSize="16px">
                    {selectedFromName}
                  </Box>
                  <ChevronDownIcon />
                </Flex>
                <Modal isOpen={isFromTokenOpen} onClose={onFromTokenClose}>
                  <ModalOverlay />
                  <ModalContent borderRadius="10px" w="400px" maxH="300px">
                    <ModalHeader>Select a token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody style={{ overflowY: "scroll" }}>
                      <Input
                        placeholder="Search for a token"
                        onChange={(e) => setFromTokenSearch(e?.target?.value)}
                      />
                      {polygon
                        .filter((val) => {
                          if (fromTokenSearch == "") {
                            return val;
                          } else if (
                            (val.symbol || val.name)
                              .toLowerCase()
                              .includes(fromTokenSearch?.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((e, i) => {
                          return (
                            <>
                              <Box
                                p="10px"
                                _hover={{ cursor: "pointer", bg: hoverColor }}
                                borderRadius="10px"
                                mt="5px"
                                onClick={() => (
                                  setSelectedFromToken(e?.address),
                                  setSelectedImage(e?.logoURI),
                                  setselectedFromName(e?.symbol),
                                  setFromDecimals(e?.decimals),
                                  onFromTokenClose()
                                )}
                              >
                                <Flex justifyContent="space-between">
                                  <Box>
                                    <Image
                                      boxSize="30px"
                                      borderRadius="full"
                                      src={e?.logoURI}
                                    />
                                  </Box>
                                  <Box fontWeight="500">{e?.symbol}</Box>
                                </Flex>
                              </Box>
                            </>
                          );
                        })}
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            </Flex>
            <Box>
              <Input
                borderRadius="9px"
                border="1px solid #636778"
                _dark={{ bg: "#2F313C" }}
                placeholder="enter amount"
                value={fromAmount}
                onChange={(e) => setFromAmount(e?.target?.value)}
              />
            </Box>
          </Flex>
        </Box>

        <Box mt="30px">
          <Flex flexDir="column">
            <Flex>
              <Flex
                alignItems="center"
                _hover={{ cursor: "pointer" }}
                onClick={onToTokenOpen}
              >
                <Image
                  src={selectedToImage}
                  boxSize="20px"
                  borderRadius="300px"
                />
                <Box pl="3px" fontWeight="700" fontSize="16px">
                  {selectedToName}
                </Box>
                <ChevronDownIcon />
              </Flex>
              <Modal isOpen={isToTokenOpen} onClose={onToTokenClose}>
                <ModalOverlay />
                <ModalContent borderRadius="10px" w="400px" maxH="300px">
                  <ModalHeader>Select a token</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody style={{ overflowY: "scroll" }}>
                    <Input
                      placeholder="Search for a token"
                      onChange={(e) => setToTokenSearch(e?.target?.value)}
                    />
                    {polygon
                      .filter((val) => {
                        if (toTokenSearch == "") {
                          return val;
                        } else if (
                          (val.symbol || val.name)
                            .toLowerCase()
                            .includes(toTokenSearch?.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map((e, i) => {
                        return (
                          <>
                            <Box
                              p="10px"
                              _hover={{ cursor: "pointer", bg: hoverColor }}
                              borderRadius="10px"
                              mt="5px"
                              onClick={() => (
                                setSelectedToToken(e?.address),
                                setSelectedToImage(e?.logoURI),
                                setselectedToName(e?.symbol),
                                setToDecimals(e?.decimals),
                                onToTokenClose()
                              )}
                            >
                              <Flex justifyContent="space-between">
                                <Box>
                                  <Image
                                    boxSize="30px"
                                    borderRadius="full"
                                    src={e?.logoURI}
                                  />
                                </Box>
                                <Box fontWeight="500">{e?.symbol}</Box>
                              </Flex>
                            </Box>
                          </>
                        );
                      })}
                  </ModalBody>

                  <ModalFooter></ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            <Box>
              <Input
                borderRadius="9px"
                border="1px solid #636778"
                _dark={{ bg: "#2F313C" }}
                value={(response?.buyAmount / 10 ** toDecimals)?.toFixed(3)}
              />
            </Box>
          </Flex>
        </Box>

        <Flex mt="30px" justifyContent="flex-end">
          <Box>
            <Button borderRadius="8px" bg="#405CF9" onClick={() => approve0x()}>
              Approve
            </Button>
            <Button
              ml="3px"
              borderRadius="8px"
              bg="#405CF9"
              onClick={() => send0xTransaction()}
            >
              Swap
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Dex;
