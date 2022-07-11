export type AddressMapType<T> = {
  [address: string]: T;
};

interface AddressRelatedObject {
  address: string;
}

function arrayToAddressMap<T extends AddressRelatedObject>(targetDataArray: T[]): AddressMapType<T> {
  const result: AddressMapType<T> = {};
  targetDataArray.forEach((targetData) => (result[targetData.address] = targetData));
  return result;
}

export default arrayToAddressMap;
