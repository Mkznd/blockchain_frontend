import contract from './contract.json';

export default async function getAbi() {
    return Promise.resolve(contract.abi);
}
