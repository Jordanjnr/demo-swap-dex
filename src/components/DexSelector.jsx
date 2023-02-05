import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  useColorMode,
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";
import Dex from "./Dex";
import FetchBalances from "./FetchBalances";
import axios from "axios";

const DexSelector = () => {
  const { colorMode } = useColorMode();
  const [bgColor, setBgColor] = useState(" #FFFFFF");

  useEffect(() => {
    if (colorMode === "dark") {
      setBgColor("#252731");
    }
  }, [colorMode]);

  return (
    <>
      <Flex mt="10px" alignItems="center" justifyContent="center">
        <Tabs variant="unstyled">
          <TabList
            bg="#F2F2F2"
            p="2px"
            borderRadius="12px"
            _dark={{ bg: "#4A4D59" }}
          >
            <Tab _selected={{ bg: bgColor, borderRadius: "10px" }}>Swap</Tab>
            <Tab _selected={{ bg: bgColor, borderRadius: "10px" }}>Limit</Tab>
            <Tab _selected={{ bg: bgColor, borderRadius: "10px" }}>
              Liquidity
            </Tab>
            <Tab _selected={{ bg: bgColor, borderRadius: "10px" }}>
              Perpetual
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack>
                <Box
                  borderRadius="20px"
                  h="370px"
                  w="110%"
                  bg="white"
                  _dark={{ bg: "#4A4D59" }}
                  p="20px"
                >
                  <Dex />
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <Box
                  borderRadius="20px"
                  h="408px"
                  w="110%"
                  bg="white"
                  _dark={{ bg: "#4A4D59" }}
                  p="20px"
                >
                  {/*     <LimitOrders /> */}
                  {/*   <TestLimtOrder /> */}
                  {/*       <Limitlesss /> */}
                  <FetchBalances />
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <Box
                  borderRadius="20px"
                  h="408px"
                  w="110%"
                  bg="white"
                  _dark={{ bg: "#4A4D59" }}
                  p="20px"
                >
                  Liquidity
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <Box
                  borderRadius="20px"
                  h="408px"
                  w="110%"
                  bg="white"
                  _dark={{ bg: "#4A4D59" }}
                  p="20px"
                >
                  Perpetual
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default DexSelector;
