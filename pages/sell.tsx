import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { Form, useNotification } from 'web3uikit';

import basicNftAbi from '../constants/BasicNft.json';
import nftMarketplaceAbi from '../constants/NFTMarketplace.json';
import networkMapping from '../constants/networkMapping.json';

// Can list NFTs
// Can withdraw proceeds

const Sell: NextPage = () => {
  const [proceeds, setProceeds] = useState('0');
  const { isWeb3Enabled } = useMoralis();
  const { chainId } = useMoralis();
  const dispatchNotification = useNotification();
  const chainIdString = chainId ? parseInt(chainId) : 31337;
  const marketPlaceAddress =
    networkMapping[chainIdString as 31337].NFTMarketplace[0];
  const { runContractFunction } = useWeb3Contract({});

  async function runGetProceeds() {
    const proceedsResponse: any = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketPlaceAddress,
        functionName: 'getProceeds',
        params: {
          seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        },
      },
      onError: (err) => console.error(err),
    });

    setProceeds(
      ethers.utils.formatEther(parseInt(proceedsResponse._hex).toString())
    );
  }

  function runWithdrawProceeds() {
    runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketPlaceAddress,
        functionName: 'withdrawProceeds',
        params: {},
      },
      onError: (err) => console.error(err),
      onSuccess: async (tx: any) => {
        if (tx) {
          await tx.wait(1);
        }
        dispatchNotification({
          type: 'success',
          position: 'topR',
          message: 'Withdraw successful!',
          title: 'Sell NFT',
        });
      },
    });
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      runGetProceeds();
    }
  }, [isWeb3Enabled]);

  function runListNft(listNftObj: object) {
    runContractFunction({
      params: listNftObj,
      onError: (error) => console.error(error),
      onSuccess: async (tx: any) => {
        await tx.wait(1);
        dispatchNotification({
          position: 'topR',
          type: 'success',
          message: 'Listed successfully',
          title: 'NFT Listing',
        });
      },
    });
  }

  async function approveAndList(data: any) {
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils.parseEther(data.data[2].inputResult).toString();
    const approveOptions = {
      abi: basicNftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketPlaceAddress,
        tokenId: tokenId,
      },
    };

    runContractFunction({
      params: approveOptions,
      onError: (err) => console.error(err),
      onSuccess: async (tx: any) => {
        await tx.wait(1);
        dispatchNotification({
          type: 'success',
          position: 'topR',
          message: 'Approval successful',
          title: 'NFT Listing',
        });
        runListNft({
          abi: nftMarketplaceAbi,
          contractAddress: marketPlaceAddress,
          functionName: 'listItem',
          params: {
            nftAddress: approveOptions.contractAddress,
            tokenId: approveOptions.params.tokenId,
            price,
          },
        });
      },
    });
  }

  return (
    <div className="flex items-center flex-col pt-8">
      <Form
        id="sell_nft"
        data={[
          {
            name: 'NFT Address',
            type: 'text',
            value: '',
            key: 'nftAddress',
          },
          {
            name: 'Token Id',
            type: 'text',
            value: '',
            key: 'tokenId',
          },
          {
            name: 'Price (In ETH)',
            type: 'text',
            value: '',
            key: 'price',
          },
        ]}
        title="Sell your NFT"
        onSubmit={approveAndList}
      ></Form>
      <div className="border-b-2 text-gray-500 w-full my-5" />
      <h2 className="font-bold text-2xl text-gray-400">Withdraw proceeds</h2>
      <div className="text-left text-lg w-80 mt-5">
        <p>Your balance - {proceeds} ETH</p>
        <button
          className="border-2 border-gray-500 py-1 px-5 mt-5 rounded"
          onClick={runWithdrawProceeds}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Sell;
