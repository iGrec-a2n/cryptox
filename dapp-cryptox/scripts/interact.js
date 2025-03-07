import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import CryptoWalletABI from "../abis/CryptoWalletABI.json"; // Ton ABI

// Charger la clé privée depuis .env
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = "ADRESSE_DU_CONTRAT"; // Remplace par l'adresse du contrat

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

// Client pour lire les infos (ex: solde)
const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// Client pour envoyer des transactions
const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});

async function getBalance(userAddress) {
  const balance = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CryptoWalletABI,
    functionName: "getBalance",
    args: [userAddress],
  });

  console.log(`Solde de ${userAddress} : ${balance} wei`);
}

async function depositFunds(amount) {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CryptoWalletABI,
    functionName: "deposit",
    value: parseEther(amount), // Convertir ETH en wei
  });

  console.log("Dépôt en cours... Hash :", hash);
  await walletClient.waitForTransactionReceipt({ hash });
  console.log("Dépôt réussi !");
}

async function withdrawFunds(amount) {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CryptoWalletABI,
    functionName: "withdraw",
    args: [parseEther(amount)],
  });

  console.log("Retrait en cours... Hash :", hash);
  await walletClient.waitForTransactionReceipt({ hash });
  console.log("Retrait effectué !");
}

// Tester les fonctions
(async () => {
  const user = account.address;

  console.log("\n🔍 Vérification du solde...");
  await getBalance(user);

  console.log("\n💰 Dépôt de 0.01 ETH...");
  await depositFunds("0.01");

  console.log("\n🔍 Vérification du solde après dépôt...");
  await getBalance(user);

  console.log("\n🏦 Retrait de 0.005 ETH...");
  await withdrawFunds("0.005");

  console.log("\n🔍 Vérification du solde après retrait...");
  await getBalance(user);
})();
