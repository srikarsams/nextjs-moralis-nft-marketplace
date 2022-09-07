/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { Card, useNotification } from 'web3uikit';
import { ethers } from 'ethers';

import basicNftAbi from '../../constants/BasicNft.json';
import nftMarketPlaceAbi from '../../constants/NFTMarketplace.json';
import { UpdateModal } from '../update-modal/UpdateModal';

interface INFTCardProps {
  price: string;
  nftAddress: string;
  seller: string;
  tokenId: string;
  marketplaceAddress: string;
}

export function NFTCard({
  price,
  nftAddress,
  seller,
  tokenId,
  marketplaceAddress,
}: INFTCardProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isWeb3Enabled, account } = useMoralis();
  const dispatchNotification = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: basicNftAbi,
    functionName: 'tokenURI',
    contractAddress: nftAddress,
    params: {
      tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketPlaceAbi,
    functionName: 'buyItem',
    contractAddress: marketplaceAddress,
    params: {
      nftAddress,
      tokenId,
    },
    msgValue: price,
  });

  const isNFTOwnedByUser = seller === account || !seller;
  const owner = isNFTOwnedByUser
    ? 'you'
    : `${seller.slice(0, 4)}...${seller.slice(seller.length - 4)}`;

  useEffect(() => {
    if (isWeb3Enabled) {
      fetchImage();
    }
  }, [isWeb3Enabled]);

  async function fetchImage() {
    const tokenUri = await getTokenURI();
    if (tokenUri) {
      const ipfsGwUri = (tokenUri as string).replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );
      const data = await fetch(ipfsGwUri as string).then((res) => res.json());
      if (data.image) {
        setImageUrl(data.image);
        setTokenName(data.name);
        setTokenDescription(data.description);
      }
    }
  }

  async function handleClick() {
    if (isNFTOwnedByUser) {
      setIsModalOpen(!isModalOpen);
    } else {
      await buyItem({
        onError: (error) => console.error(error),
        onSuccess: async (tx: any) => {
          await tx.wait(1);
          dispatchNotification({
            position: 'topR',
            message: 'Item bought successfully',
            type: 'success',
            title: 'Purchase notification',
          });
        },
      });
    }
  }

  return (
    <div>
      <UpdateModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        price={price}
        tokenId={tokenId}
        nftAddress={nftAddress}
        marketplaceAddress={marketplaceAddress}
      />
      <Card
        title={tokenName}
        description={tokenDescription}
        onClick={handleClick}
      >
        <div className="flex justify-between align-baseline">
          <div>
            <div>#{tokenId}</div>
            <p className="italic text-sm">Owned by {owner}</p>
          </div>
          <p className="font-semibold text-right">
            {ethers.utils.formatUnits(price, 'ether')} ETH
          </p>
        </div>
        <Image
          src={imageUrl || 'https://placehold.jp/200x200.png?text=""'}
          alt={'NFT image'}
          height={200}
          width={200}
        />
      </Card>
    </div>
  );
}
