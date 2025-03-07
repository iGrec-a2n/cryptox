import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/CryptoWallet.sol/CryptoWallet.json" assert { type: "json" };

// Charger la clé privée depuis .env
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY manquant dans .env !");
}

// Créer un client Viem pour Hardhat
const client = createWalletClient({
  chain: hardhat,
  transport: http(),
});

// Convertir la clé privée en compte Viem
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

async function main() {
  console.log("Déploiement du smart contract...");

  // Déployer le contrat
  const hash = await client.deployContract({
    account,
    abi,
    bytecode,
  });

  console.log("Transaction envoyée ! Hash :", hash);

  // Attendre la confirmation
  const receipt = await client.waitForTransactionReceipt({ hash });

  console.log("Contrat déployé à l'adresse :", receipt.contractAddress);
}

main().catch((err) => {
  console.error("Erreur de déploiement :", err);
});
