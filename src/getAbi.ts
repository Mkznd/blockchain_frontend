export default async function getAbi() {
    const response = await fetch(import.meta.env.VITE_ABI_URL+"/Crowdfunding.sol/Crowdfunding.json");
    const data = await response.json();
    return data.abi;
}
