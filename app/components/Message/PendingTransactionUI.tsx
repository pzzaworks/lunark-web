"use client";
import { useState } from 'react';
import { useTransactionExecutor } from '@/hooks/useTransactionExecutor';
import { useSocketContext, PendingTransaction } from '@/contexts/SocketContext';
import Button from '../Base/Button';
import { networks } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { baseContainerStyle } from '@/constants';

interface PendingTransactionUIProps {
  transaction: PendingTransaction;
}

export const PendingTransactionUI = ({ transaction }: PendingTransactionUIProps) => {
  const { executeTransaction } = useTransactionExecutor();
  const { clearPendingTransaction } = useSocketContext();
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getExplorerUrl = (chainId: number, hash: string) => {
    const network = networks.find(n => n.chainId === chainId);
    if (!network) return `${transaction.explorerUrl}/tx/${hash}`;
    return `${network.explorerUrl}/tx/${hash}`;
  };

  const handleExecute = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setError(null);

    try {
      const result = await executeTransaction(transaction.transaction);
      if (result === null) {
        // User rejected the transaction, just reset state
        return;
      }
      if (result?.hash) {
        setTxHash(result.hash);
        // Clear the pending transaction after successful execution
        setTimeout(() => {
          clearPendingTransaction();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = () => {
    clearPendingTransaction();
  };

  // Format details for display
  const formatDetails = () => {
    const { details, type } = transaction;

    if (type === 'transfer') {
      const shortTo = `${details.to.slice(0, 6)}...${details.to.slice(-4)}`;
      return (
        <div className="text-sm text-gray-400 space-y-1">
          <p>To: <span className="text-gray-200">{details.resolvedFrom || shortTo}</span></p>
          <p>Amount: <span className="text-gray-200">{details.amount} {details.symbol}</span></p>
        </div>
      );
    }

    if (type === 'approve') {
      return (
        <div className="text-sm text-gray-400 space-y-1">
          <p>Token: <span className="text-gray-200">{details.tokenSymbol}</span></p>
          <p>Spender: <span className="text-gray-200">{details.spenderName || `${details.spender.slice(0, 6)}...${details.spender.slice(-4)}`}</span></p>
          <p>Amount: <span className="text-gray-200">{details.amount}</span></p>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${baseContainerStyle} p-4 rounded-lg mt-4 border border-gray-700`}
      >
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-200">
              {transaction.type === 'transfer' ? 'Token Transfer' : 'Token Approval'}
            </h3>
            {!txHash && !isExecuting && (
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-300"
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Details */}
          {formatDetails()}

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {!txHash ? (
              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                loading={isExecuting}
                variant="default"
                size="md"
                rounded="lg"
                className="text-green-500"
              >
                {isExecuting ? 'Confirming...' : transaction.buttonText}
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <span className="text-green-500 text-sm">Transaction submitted!</span>
                <Button
                  onClick={() => window.open(getExplorerUrl(transaction.transaction.chainId, txHash), '_blank', 'noopener,noreferrer')}
                  variant="default"
                  size="md"
                  rounded="lg"
                  className="text-sky-500"
                >
                  View Transaction
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
