import type { NextPage } from 'next';
import { useMoralis, useMoralisQuery } from 'react-moralis';

import { NFTCard } from '../components/nft-card/NFTCard';

const Home: NextPage = () => {
  const { data: listedNfts, isFetching } = useMoralisQuery(
    'ActiveItem',
    (query) => query.limit(10).descending('tokenId')
  );
  const { isWeb3Enabled } = useMoralis();

  if (!isWeb3Enabled) {
    return (
      <h1 className="font-bold text-2xl text-center py-6">
        Please link your wallet to view the NFTs.
      </h1>
    );
  }

  if (isFetching) {
    return <div>Fetching NFTs...</div>;
  }

  return (
    <div className="pt-4">
      <h1 className="font-bold text-xl">Recently Listed</h1>
      <div className="pt-4 flex flex-1 flex-wrap gap-y-5 gap-x-2">
        {listedNfts.map((nft) => {
          const { price, nftAddress, seller, tokenId, marketplaceAddress } =
            nft.attributes;
          return (
            <NFTCard
              key={nft.id}
              nftAddress={nftAddress}
              seller={seller}
              tokenId={tokenId}
              price={price}
              marketplaceAddress={marketplaceAddress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
