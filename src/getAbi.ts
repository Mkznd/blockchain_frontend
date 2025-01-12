export default async function getAbi() {
    const response = await fetch("http://127.0.0.1:3001/Crowdfunding.sol/Crowdfunding.json");
    const data = await response.json();
    return data.abi;
}
