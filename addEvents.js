const moralis = require('moralis-v1/node');
const dotenv = require('dotenv');
const contractAddresses = require('./constants/networkMapping.json');

dotenv.config();

const chainId = process.env.chainId || '31337';
const moralisChainId = '1337';

const contractAddress = contractAddresses[chainId]['NFTMarketplace'][0];
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.moralisMasterKey;

async function main() {
  await moralis.start({ serverUrl, appId, masterKey });
  console.log(`working with ${contractAddress}`);

  const itemListedOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    address: contractAddress,
    topic: 'ItemListed(address,address,uint256,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemListed',
      type: 'event',
    },
    tableName: 'ItemListed',
  };

  const itemBoughtOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    address: contractAddress,
    topic: 'ItemBought(address,address,uint256,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'buyer',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemBought',
      type: 'event',
    },
    tableName: 'ItemBought',
  };

  const itemCancelledOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    address: contractAddress,
    topic: 'ItemCancelled(address,address,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddressed',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ItemCancelled',
      type: 'event',
    },
    tableName: 'ItemCancelled',
  };

  const itemUpdatedOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    address: contractAddress,
    topic: 'ItemUpdated(address,address,uint256,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemUpdated',
      type: 'event',
    },
    tableName: 'ItemUpdated',
  };

  const listedResponse = await moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    {
      useMasterKey: true,
    }
  );
  const boughtResponse = await moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  );
  const canceledResponse = await moralis.Cloud.run(
    'watchContractEvent',
    itemCancelledOptions,
    {
      useMasterKey: true,
    }
  );
  const updatedResponse = await moralis.Cloud.run(
    'watchContractEvent',
    itemUpdatedOptions,
    {
      useMasterKey: true,
    }
  );
  if (
    listedResponse.success &&
    canceledResponse.success &&
    boughtResponse.success &&
    updatedResponse.success
  ) {
    console.log('Success! Database Updated with watching events');
  } else {
    console.log('Something went wrong...');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
