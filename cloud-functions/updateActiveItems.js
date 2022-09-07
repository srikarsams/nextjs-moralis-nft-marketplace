Moralis.Cloud.afterSave('ItemListed', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();

  logger.info('ItemListed - Looking for confirmed TX');

  if (confirmed) {
    logger.info('ItemListed - Found Item!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));

    logger.info(
      `ItemListed - Adding Address: ${request.object.get(
        'address'
      )} TokenId: ${request.object.get('tokenId')}`
    );
    logger.info('Saving...');
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave('ItemCancelled', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();

  logger.info(`ItemCancelled - Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const query = new Moralis.Query(ActiveItem);

    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddressed'));
    query.equalTo('tokenId', request.object.get('tokenId'));

    logger.info(`ItemCancelled - Query: ${query}`);

    const canceledItem = await query.first();
    logger.info(`ItemCancelled - Canceled Item: ${canceledItem}`);

    if (canceledItem) {
      logger.info(`ItemCancelled - Deleting ${canceledItem.id}`);
      await canceledItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          'tokenId'
        )} at address ${request.object.get('address')} since it was canceled.`
      );
    } else {
      logger.info(
        `No item canceled with address: ${request.object.get(
          'address'
        )} and tokenId: ${request.object.get('tokenId')} found.`
      );
    }
  }
});

Moralis.Cloud.afterSave('ItemBought', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();

  logger.info(`ItemBought - Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const query = new Moralis.Query(ActiveItem);

    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));

    logger.info(`ItemBought - Query: ${query}`);

    const boughtItem = await query.first();
    logger.info(`ItemBought - Bought Item: ${boughtItem.tokenId}`);

    if (boughtItem) {
      logger.info(`ItemBought- Deleting boughtItem ${boughtItem.id}`);
      await boughtItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          'tokenId'
        )} at address ${request.object.get(
          'address'
        )} from ActiveItem table since it was bought.`
      );
    } else {
      logger.info(
        `No item bought with address: ${request.object.get(
          'address'
        )} and tokenId: ${request.object.get('tokenId')} found`
      );
    }
  }
});

Moralis.Cloud.afterSave('ItemUpdated', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('Looking for confirmed TX... itemUpdated');
  if (confirmed) {
    logger.info('ItemUpdated - Found item!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    // In case of listing update, search for already listed ActiveItem and delete
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('seller', request.object.get('seller'));
    logger.info(`ItemUpdated | Query: ${query}`);
    const alreadyListedItem = await query.first();
    logger.info(
      `ItemUpdated - alreadyListedItem ${JSON.stringify(alreadyListedItem)}`
    );
    if (alreadyListedItem) {
      logger.info(`ItemUpdated - Deleting ${alreadyListedItem.id}`);
      await alreadyListedItem.destroy();
      logger.info(
        `ItemUpdated -Deleted item with tokenId ${request.object.get(
          'tokenId'
        )} at address ${request.object.get(
          'address'
        )} since the listing is being updated. `
      );
    }

    // Add new ActiveItem
    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));
    logger.info(
      `ItemUpdated - Adding Address: ${request.object.get(
        'address'
      )} TokenId: ${request.object.get('tokenId')}`
    );
    logger.info('Saving...');
    await activeItem.save();
  }
});
