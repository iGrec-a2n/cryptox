import { useState } from "react";
import { useAccount, 
  // useBalance,
  useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export default function SendCrypto() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();
  // const { data: balance } = useBalance({ address });
  const { sendTransaction, status, isSuccess, error } = useSendTransaction();
  const handleSend = async () => {
    if (!isConnected) return alert("Connectez votre wallet");
    if (!recipient || !amount) return alert("Entrez une adresse et un montant");
    if (parseFloat(amount) <= 0) return alert("Le montant doit être supérieur à 0");

    try {
      await sendTransaction({
        to: `0x${recipient.replace(/^0x/, '')}`,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Erreur de transaction", err);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold">Envoyer des cryptos</h2>
      <input
        className="border p-2 rounded w-full mt-2"
        type="text"
        placeholder="Adresse du destinataire"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full mt-2"
        type="number"
        placeholder="Montant en ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
        onClick={handleSend}
        disabled={status === 'loading'}
      >
        {isLoading ? "Envoi en cours..." : "Envoyer"}
      </button>
      {isSuccess && <p className="text-green-500 mt-2">Transaction réussie !</p>}
      {error && <p className="text-red-500 mt-2">Erreur : {error.message}</p>}
    </div>
  );
};

