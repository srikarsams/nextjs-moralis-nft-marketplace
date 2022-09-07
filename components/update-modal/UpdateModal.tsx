import { ethers } from 'ethers';
import { useState } from 'react';
import { useWeb3Contract } from 'react-moralis';
import { Input, Modal, useNotification } from 'web3uikit';

import NFTMarketplaceABI from '../../constants/NFTMarketplace.json';

interface IUpdateModalProps {
  nftAddress: string;
  isVisible: boolean;
  tokenId: string;
  price: string;
  marketplaceAddress: string;
  onClose: () => void;
}

export function UpdateModal({
  nftAddress,
  isVisible,
  tokenId,
  price,
  marketplaceAddress,
  onClose,
}: IUpdateModalProps) {
  const [newPrice, setNewPrice] = useState(price);
  const dispatchNotification = useNotification();

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: NFTMarketplaceABI,
    functionName: 'updateListing',
    contractAddress: marketplaceAddress,
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.utils.parseEther(newPrice),
    },
  });

  async function handleSubmit() {
    const res = await updateListing({
      onError: (err) => console.error(err),
      onSuccess: async (tx: any) => {
        await tx.wait(1);
        dispatchNotification({
          type: 'success',
          message: 'Price updated!',
          title: 'Listing updated',
          position: 'topR',
        });
        onClose();
      },
    });
  }

  return (
    <Modal
      isVisible={isVisible}
      onOk={handleSubmit}
      onCloseButtonPressed={onClose}
      onCancel={onClose}
    >
      {/* <div className="py-2">
        <Input type="text" value={nftAddress} disabled />
      </div>
      <div className="py-2">
        <Input type="text" value={tokenId} disabled />
      </div> */}
      <div className="py-2 text-center">
        <Input
          type="text"
          value={ethers.utils.formatEther(price)}
          label="Update Listing price in ETH"
          name="new_price"
          onChange={(e) => setNewPrice(e.target.value)}
        />
      </div>
    </Modal>
  );
}
