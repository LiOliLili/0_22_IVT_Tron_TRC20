import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [tronWeb, setTronWeb] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [contract, setContract] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', decimals: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState([]);

  const CONTRACT_ADDRESS = 'TF1UG7ocJmMR1Au25K1dfMjVxPgz12GR4D';
  const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleAccountChange = (accounts) => {
      if (accounts?.base58) {
        setAccount(accounts.base58);
        localStorage.setItem('tronAccount', accounts.base58);
      } else {
        setAccount(null);
        localStorage.removeItem('tronAccount');
      }
    };

    if (window.tronWeb) {
      window.tronWeb.on('addressChanged', handleAccountChange);
    }

    return () => {
      if (window.tronWeb) {
        window.tronWeb.off('addressChanged', handleAccountChange);
      }
    };
  }, []);

  const loadTransactionHistory = useCallback(async (tw) => {
    if (!tw || !tw.defaultAddress?.base58) return;

    // Функция для нормализации hex-адресов (добавляем её внутри useCallback)
    const normalizeHex = (addr) => {
      if (!addr) return '';
      return addr.toLowerCase().replace(/^0x/, '').replace(/^41/, '');
    };

    try {
      const walletAddress = tw.defaultAddress.base58;
      const walletHex = tw.address.toHex(walletAddress)
        .toLowerCase()
        .replace(/^41/, '')
        .replace(/^0x/, '');

      // 1. Загружаем confirmed транзакции из блокчейна
      let events = [];
      try {
        events = await tw.getEventResult(CONTRACT_ADDRESS, {
          eventName: 'Transfer',
          onlyConfirmed: true,
          limit: 100
        });
      } catch (error) {
        console.error('Ошибка при загрузке событий:', error);
      }

      // 2. Загружаем pending транзакции из localStorage
      let pendingTxs = JSON.parse(localStorage.getItem('pendingTxs') || '[]');

      // 3. Объединяем транзакции, сохраняя direction для существующих
      const allTransactions = [
        ...pendingTxs,
        ...(Array.isArray(events) ? events.map(event => {
          if (!event?.result) return null; // Пропускаем события без result

          const fromHex = normalizeHex(event.result.from);
          const toHex = normalizeHex(event.result.to);

          if (!fromHex || !toHex) return null; // Пропускаем события без from/to

          const isReceived = toHex === walletHex;

          // Проверяем, есть ли уже такая транзакция в pending
          const existingTx = pendingTxs.find(tx =>
            tx.transactionId === (event.transactionId || event.transaction)
          );

          return {
            ...event,
            transactionId: event.transactionId || event.transaction,
            direction: existingTx?.direction || (isReceived ? 'received' : 'sent'),
            partnerAddress: tw.address.fromHex(
              isReceived ? `41${fromHex}` : `41${toHex}`
            ),
            status: 'confirmed',
            timestamp: event.timestamp || Date.now(),
            value: event.result.value || 0
          };
        }).filter(Boolean) : []) // Фильтруем null значения
      ].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setTransactions(allTransactions);

    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      setTransactions([]); // В случае ошибки сбрасываем список транзакций
    }
  }, []);

  const updateBalance = useCallback(async (contractInstance, tw) => {
    if (!contractInstance || !tw?.defaultAddress?.base58) return;

    try {
      const result = await contractInstance.balanceOf(tw.defaultAddress.base58).call();
      const formattedBalance = result / (10 ** tokenInfo.decimals);
      setBalance(formattedBalance);

      // Добавляем текущий баланс в историю
      setBalanceHistory(prev => {
        const newEntry = {
          value: formattedBalance,
          timestamp: Date.now()
        };
        // Сохраняем только последние 30 записей
        return [...prev.slice(-29), newEntry];
      });
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
    }
  }, [tokenInfo.decimals]);

  const initContract = useCallback(async (tw) => {
    if (!tw) return;
  
    try {
      const contractInstance = await tw.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
  
      const [name, symbol, decimals] = await Promise.all([
        contractInstance.name().call(),
        contractInstance.symbol().call(),
        contractInstance.decimals().call()
      ]);
  
      setTokenInfo({ name, symbol, decimals });
      
      // Сначала загружаем историю для графика
      //await loadTransactionHistoryForGraph(tw);
      
      // Затем обновляем текущий баланс
      await updateBalance(contractInstance, tw);
      
      // И только потом загружаем историю транзакций
      await loadTransactionHistory(tw);
    } catch (error) {
      console.error('Ошибка инициализации:', error);
    }
  }, [updateBalance, loadTransactionHistory]);

  const connectTronLink = useCallback(async () => {
    if (!window.tronWeb) {
      alert('Пожалуйста, установите TronLink!');
      window.open('https://www.tronlink.org/', '_blank');
      return;
    }

    setIsLoading(true);
    try {
      await window.tronWeb.request({ method: 'tron_requestAccounts' });
      const tw = window.tronWeb;
      setTronWeb(tw);
      setAccount(tw.defaultAddress.base58);
      localStorage.setItem('tronAccount', tw.defaultAddress.base58);
      await initContract(tw);
    } catch (error) {
      console.error('Ошибка подключения:', error);
      alert('Ошибка подключения: ' + error.message);
      localStorage.removeItem('tronAccount');
    } finally {
      setIsLoading(false);
    }
  }, [initContract]);

  useEffect(() => {
    const savedAccount = localStorage.getItem('tronAccount');
    if (savedAccount && window.tronWeb?.ready) {
      const tw = window.tronWeb;
      setTronWeb(tw);
      setAccount(savedAccount);
      initContract(tw);
    }
  }, [initContract]);

  const sendTokens = async () => {
    if (!contract || !toAddress || !amount || !tronWeb) return;

    setIsLoading(true);
    try {
      if (!tronWeb.isAddress(toAddress)) {
        alert('Неверный адрес получателя');
        return;
      }

      const amountStr = amount.toString().trim();
      if (isNaN(amountStr)) {
        alert('Введите корректное количество токенов');
        return;
      }

      const amountInSmallestUnit = tronWeb.toBigNumber(amountStr)
        .times(10 ** tokenInfo.decimals)
        .integerValue()
        .toString();

      const currentBalance = await contract.balanceOf(account).call();
      if (tronWeb.toBigNumber(currentBalance).lt(amountInSmallestUnit)) {
        alert('Недостаточно средств');
        return;
      }

      const tx = await contract.transfer(toAddress, amountInSmallestUnit).send({
        feeLimit: 100000000,
        callValue: 0
      });

      const pendingTx = {
        transactionId: tx,
        result: {
          value: amountInSmallestUnit,
          from: account,
          to: toAddress
        },
        direction: 'sent', // Явно указываем направление
        status: 'pending',
        timestamp: Date.now()
      };

      const updatedPending = [pendingTx, ...transactions];
      setTransactions(updatedPending);
      localStorage.setItem('pendingTxs', JSON.stringify(updatedPending));
      setBalance(prev => prev - parseFloat(amountStr));
      monitorTransactionStatus(tx, tronWeb);

      alert(`Транзакция отправлена! TX Hash: ${tx}\nСтатус можно проверить на Tronscan.`);
      setToAddress('');
      setAmount('');
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  const monitorTransactionStatus = async (txId, tw = tronWeb) => {
    let attempts = 0;
    const maxAttempts = 30;
    const checkInterval = 10000;

    const checkStatus = async () => {
      try {
        attempts++;
        const txInfo = await tw.trx.getTransactionInfo(txId);

        if (txInfo && txInfo.receipt) {
          const isSuccess = txInfo.receipt.result === 'SUCCESS' || txInfo.receipt.energy_usage_total > 0;
          const isFailed = txInfo.receipt.result === 'FAILED' || txInfo.receipt.energy_usage_total === 0;

          if (isSuccess) return updateTransactionStatus(txId, 'confirmed'), true;
          if (isFailed) return updateTransactionStatus(txId, 'failed'), true;
        }

        try {
          const confirmed = await tw.trx.getConfirmedTransaction(txId);
          if (confirmed) return updateTransactionStatus(txId, 'confirmed'), true;
        } catch { }

        console.log(`Попытка ${attempts}: транзакция ${txId} всё еще не подтверждена`);
      } catch (error) {
        console.error(`Ошибка при проверке статуса транзакции ${txId}:`, error);
      }
      return false;
    };

    const updateTransactionStatus = (txId, status) => {
      setTransactions(prev => {
        const updated = prev.map(tx => {
          if (tx.transactionId === txId) {
            // Сохраняем все существующие данные транзакции, включая direction
            return {
              ...tx,
              status,
              // Для подтвержденных транзакций обновляем данные из блокчейна
              ...(status === 'confirmed' ? {
                timestamp: Date.now()
              } : {})
            };
          }
          return tx;
        });

        // Сохраняем только pending и timeout транзакции
        const stillPending = updated.filter(tx =>
          tx.status === 'pending' || tx.status === 'timeout'
        );
        localStorage.setItem('pendingTxs', JSON.stringify(stillPending));

        return updated;
      });

      // Обновляем баланс и историю
      updateBalance(contract, tronWeb);
      loadTransactionHistory(tronWeb);
    };

    const immediateCheck = await checkStatus();
    if (immediateCheck) return;

    const intervalId = setInterval(async () => {
      const isDone = await checkStatus();
      if (isDone || attempts >= maxAttempts) {
        clearInterval(intervalId);
        if (attempts >= maxAttempts) {
          console.log(`Достигнуто максимальное количество попыток для транзакции ${txId}`);
          setTransactions(prev => {
            const updated = prev.map(tx =>
              tx.transactionId === txId ? { ...tx, status: 'timeout' } : tx
            );
            const stillPending = updated.filter(tx => tx.status === 'pending');
            localStorage.setItem('pendingTxs', JSON.stringify(stillPending));
            return updated;
          });
        }
      }
    }, checkInterval);
  };

  useEffect(() => {
    const tryConnectTronLink = async () => {
      let attempts = 0;
      const maxAttempts = 10;
      const delay = 500;

      const interval = setInterval(() => {
        if (window.tronWeb && window.tronWeb.ready) {
          connectTronLink();
          clearInterval(interval);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            console.warn('TronLink не инициализировался за отведённое время');
            clearInterval(interval);
          }
        }
      }, delay);
    };
    tryConnectTronLink();
  }, [connectTronLink]);

  useEffect(() => {
    const restoreAndRetryPending = async () => {
      if (!tronWeb || !contract) return;
      const stored = JSON.parse(localStorage.getItem('pendingTxs') || '[]');
      if (stored.length > 0) {
        setTransactions(prev => {
          const ids = new Set(prev.map(tx => tx.transactionId));
          return [...stored.filter(tx => !ids.has(tx.transactionId)), ...prev];
        });
        for (const tx of stored) {
          if (tx.status === 'pending' || tx.status === 'timeout') {
            monitorTransactionStatus(tx.transactionId, tronWeb);
          }
        }
      }
    };
    restoreAndRetryPending();
  }, [tronWeb, contract]);

  return (
    <div className={`App ${isMobile ? 'mobile' : ''}`}>
      <header className="App-header">
        <h1>{tokenInfo.name || 'TRC20 Token'} Wallet</h1>

        {!account ? (
          <button
            onClick={connectTronLink}
            className="connect-button"
            disabled={isLoading}
          >
            {isLoading ? 'Подключение...' : 'Подключить TronLink'}
          </button>
        ) : (
          <div className="token-interface">
            <div className="wallet-info">
              <h2>Ваш баланс:</h2>
              <p className="balance">{balance.toLocaleString()} {tokenInfo.symbol}</p>
              <p className="address">Адрес: {account}</p>
            </div>

            <div className="transfer-section">
              <h3>Отправить токены</h3>
              <div className="form-group">
                <label>Адрес получателя:</label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="T..."
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>Количество ({tokenInfo.symbol}):</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendTokens}
                className="send-button"
                disabled={!toAddress || !amount || isLoading}
              >
                {isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>

            {transactions.length > 0 && (
              <div className="transaction-history">
                <h3>Последние транзакции</h3>
                <div className="transactions-container">
                  <div className="transactions-list">
                    {transactions.map((tx) => {
                      // Проверяем, что у нас есть все необходимые данные
                      if (!tx.result || !tx.result.from || !tx.result.to) {
                        console.warn('Неполные данные транзакции:', tx);
                        return null;
                      }

                      // Определяем адреса отправителя и получателя
                      const fromAddress = tx.direction === 'sent' ? account : tx.partnerAddress;
                      const toAddress = tx.direction === 'sent' ? tx.partnerAddress : account;

                      return (
                        <div
                          key={tx.transactionId || tx.timestamp}
                          className={`transaction-item ${tx.status} ${tx.direction}`}
                        >
                          <div className="tx-amount">
                            {(tx.result.value / (10 ** tokenInfo.decimals)).toLocaleString()} {tokenInfo.symbol}
                          </div>
                          <div className="tx-addresses">
                            <div className="tx-address-row">
                              <span className="tx-address-label">Отправитель: </span>
                              <span className="tx-address-value">{fromAddress}</span>
                            </div>
                            <div className="tx-address-row">
                              <span className="tx-address-label">Получатель: </span>
                              <span className="tx-address-value">{toAddress}</span>
                            </div>
                          </div>
                          {tx.status === 'pending' && (
                            <div className="tx-status">
                              <span className="spinner"></span> Ожидание подтверждения...
                            </div>
                          )}
                          {tx.status === 'failed' && (
                            <div className="tx-status failed">
                              Транзакция не удалась
                            </div>
                          )}
                          {tx.status === 'timeout' && (
                            <div className="tx-status timeout">
                              Не удалось подтвердить статус
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;