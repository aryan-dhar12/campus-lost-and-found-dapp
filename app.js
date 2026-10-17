const abi = [
  "function registerItem(string title,string category,string locationFound,string description)",
  "function requestClaim(uint256 itemId)", "function approveClaim(uint256 itemId)", "function markReturned(uint256 itemId)",
  "function getAllItems() view returns ((uint256 id,string title,string category,string locationFound,string description,address finder,address claimant,uint8 status,uint256 createdAt)[])",
  "function itemCount() view returns (uint256)"
];
let provider, signer, contract;
const $ = (id) => document.getElementById(id);
function message(text, error = false) { const el = $("message"); el.textContent = text; el.className = error ? "error" : ""; }
async function requireContract() { if (!contract) throw new Error("Connect your wallet and load the deployed contract first."); }
async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask was not detected. Install MetaMask first.");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.BrowserProvider(window.ethereum); signer = await provider.getSigner();
  $("walletStatus").textContent = `Connected: ${await signer.getAddress()}`; message("Wallet connected.");
}
async function requireWallet() { if (!signer) await connectWallet(); }
async function loadContract() {
  await requireWallet(); const address = $("contractAddress").value.trim();
  if (!ethers.isAddress(address)) throw new Error("Enter a valid deployed contract address.");
  contract = new ethers.Contract(address, abi, signer); await contract.itemCount(); message("Contract loaded."); await refreshItems();
}
async function send(action) {
  try { await requireContract(); message("Confirm the transaction in MetaMask..."); const tx = await action(); message("Transaction sent. Waiting for Ganache confirmation..."); await tx.wait(); message(`Success. Transaction: ${tx.hash}`); await refreshItems(); }
  catch (error) { message(error.shortMessage || error.reason || error.message, true); }
}
async function refreshItems() {
  try {
    await requireContract(); const records = await contract.getAllItems(); const names = ["Open", "Claim requested", "Claim approved", "Returned"];
    $("items").innerHTML = records.length ? records.map(item => `<article class="item ${Number(item.status) === 3 ? "returned" : ""}"><h3>#${item.id} - ${escapeHtml(item.title)}</h3><p><strong>${escapeHtml(item.category)}</strong> | Found at ${escapeHtml(item.locationFound)} | Status: ${names[Number(item.status)]}</p><p>${escapeHtml(item.description || "No description provided.")}</p><p>Finder: <code>${item.finder}</code><br>Claimant: <code>${item.claimant}</code></p></article>`).join("") : "<p class=\"hint\">No items registered yet.</p>";
  } catch (error) { message(error.shortMessage || error.message, true); }
}
function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c])); }
$("connectButton").onclick = () => connectWallet().catch(e => message(e.message, true));
$("loadContractButton").onclick = () => loadContract().catch(e => message(e.message, true));
$("refreshButton").onclick = refreshItems;
$("registerForm").onsubmit = (e) => { e.preventDefault(); send(() => contract.registerItem($("title").value.trim(), $("category").value.trim(), $("location").value.trim(), $("description").value.trim())); };
$("claimForm").onsubmit = (e) => { e.preventDefault(); send(() => contract.requestClaim($("claimItemId").value)); };
$("approveButton").onclick = () => send(() => contract.approveClaim($("finderItemId").value));
$("returnButton").onclick = () => send(() => contract.markReturned($("finderItemId").value));
if (window.ethereum) window.ethereum.on("accountsChanged", () => location.reload());
