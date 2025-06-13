import React, { useState } from 'react';
import { useATM } from '../hooks/useATM';
import { ATMScreen } from './ATMScreen';
import { ATMButton } from './ATMButton';
import { PinInput } from './PinInput';
import { CardNumberInput } from './CardNumberInput';
import { CreditCard, ArrowLeft, DollarSign, Lock, History, User, Eye, EyeOff } from 'lucide-react';

export const ATMInterface: React.FC = () => {
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);

  const {
    currentScreen,
    currentAccount,
    enteredCardNumber,
    enteredPin,
    withdrawalAmount,
    newPin,
    confirmPin,
    setCurrentScreen,
    setCurrentAccount,
    setEnteredCardNumber,
    setEnteredPin,
    setWithdrawalAmount,
    setNewPin,
    setConfirmPin,
    createAccount,
    authenticateUser,
    withdrawCash,
    changePin,
    getAccountTransactions,
    resetSession,
    addTransaction,
  } = useATM();

  const handleLogin = () => {
    const account = authenticateUser(enteredCardNumber, enteredPin);
    if (account) {
      setCurrentAccount(account); // Fix: Properly set the current account with full data
      addTransaction({
        accountId: account.id,
        type: 'balance_inquiry',
        description: 'Login successful',
      });
      setCurrentScreen('main_menu');
    } else {
      alert('Invalid card number or PIN. Please try again.');
      setEnteredPin('');
    }
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount && amount > 0) {
      if (withdrawCash(amount)) {
        alert(`Successfully withdrawn $${amount.toFixed(2)}`);
        setWithdrawalAmount('');
        setCurrentScreen('main_menu');
      } else {
        alert('Insufficient funds or invalid amount.');
      }
    }
  };

  const handlePinChange = () => {
    if (newPin.length === 4 && newPin === confirmPin) {
      if (changePin(newPin)) {
        alert('PIN changed successfully!');
        setNewPin('');
        setConfirmPin('');
        setCurrentScreen('main_menu');
      }
    } else {
      alert('PINs do not match or invalid length.');
    }
  };

  const handleCreateAccount = () => {
    const holderName = prompt('Enter your full name:');
    const initialPin = prompt('Create a 4-digit PIN:');
    
    if (holderName && initialPin && initialPin.length === 4 && /^\d+$/.test(initialPin)) {
      const newAccount = createAccount(holderName, initialPin);
      alert(`Account created successfully!\n\nCard Number: ${newAccount.cardNumber}\nInitial Balance: $${newAccount.balance.toFixed(2)}\n\nPlease note down your card number for future logins.`);
      setCurrentScreen('welcome');
    } else {
      alert('Please provide valid information. PIN must be 4 digits.');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <ATMScreen title="WELCOME TO VIRTUAL ATM">
            <div className="text-center space-y-6">
              <div className="mb-8">
                <CreditCard size={64} className="mx-auto text-green-400 mb-4 animate-pulse" />
                <p className="text-green-300 text-lg">Your Digital Banking Solution</p>
                <p className="text-green-600 text-sm mt-2">Secure • Fast • Reliable</p>
              </div>
              
              <div className="space-y-4">
                <ATMButton 
                  onClick={() => setCurrentScreen('insert_card')}
                  className="w-full text-lg py-4"
                >
                  🏧 INSERT CARD / LOGIN
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('create_account')}
                  variant="secondary"
                  className="w-full text-lg py-4"
                >
                  ➕ CREATE NEW ACCOUNT
                </ATMButton>
              </div>

              <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-green-500/30">
                <h3 className="text-green-300 font-semibold mb-2">Demo Features:</h3>
                <div className="text-green-600 text-sm space-y-1">
                  <p>• Account Creation with $1,000 starting balance</p>
                  <p>• Cash Withdrawal & Balance Inquiry</p>
                  <p>• PIN Change & Transaction History</p>
                  <p>• Secure Authentication System</p>
                </div>
              </div>
            </div>
          </ATMScreen>
        );

      case 'create_account':
        return (
          <ATMScreen title="CREATE NEW ACCOUNT">
            <div className="text-center space-y-6">
              <User size={48} className="mx-auto text-green-400 mb-4" />
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500/30">
                <p className="text-green-300 text-lg mb-2">Start Your Banking Journey</p>
                <p className="text-green-600 text-sm">Get $1,000 starting balance with your new account!</p>
              </div>
              
              <div className="space-y-4">
                <ATMButton 
                  onClick={handleCreateAccount}
                  className="w-full text-lg py-4"
                >
                  🆕 CREATE ACCOUNT
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('welcome')}
                  variant="secondary"
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  BACK TO MAIN
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'insert_card':
        return (
          <ATMScreen title="CARD AUTHENTICATION">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CreditCard size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-green-300">Enter your 16-digit card number</p>
                <p className="text-green-600 text-sm mt-1">Numbers will be automatically formatted</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-green-300 mb-2 font-semibold">Card Number:</label>
                  <CardNumberInput
                    value={enteredCardNumber}
                    onChange={setEnteredCardNumber}
                  />
                </div>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('enter_pin')}
                  disabled={enteredCardNumber.length !== 16}
                  className="w-full"
                >
                  CONTINUE ➡️
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('welcome')}
                  variant="secondary"
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  CANCEL
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'enter_pin':
        return (
          <ATMScreen title="ENTER PIN">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Lock size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-green-300">Enter your 4-digit PIN</p>
                <p className="text-green-600 text-sm mt-1">Your PIN is encrypted and secure</p>
              </div>
              
              <PinInput
                value={enteredPin}
                onChange={setEnteredPin}
              />
              
              <div className="space-y-4">
                <ATMButton 
                  onClick={handleLogin}
                  disabled={enteredPin.length !== 4}
                  className="w-full"
                >
                  🔐 LOGIN
                </ATMButton>
                
                <ATMButton 
                  onClick={() => {
                    setEnteredPin('');
                    setCurrentScreen('insert_card');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  BACK
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'main_menu':
        return (
          <ATMScreen title="MAIN MENU">
            <div className="space-y-6">
              <div className="text-center mb-6 bg-gray-800 p-4 rounded-lg border border-green-500/30">
                <p className="text-green-300 text-lg">Welcome back, {currentAccount?.holderName}!</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-green-400 text-sm">
                    Card: {showFullCardNumber ? currentAccount?.cardNumber : `****${currentAccount?.cardNumber.slice(-4)}`}
                  </p>
                  <button
                    onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {showFullCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-green-500 text-lg font-bold mt-2">Balance: ${currentAccount?.balance.toFixed(2)}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <ATMButton 
                  onClick={() => setCurrentScreen('balance_inquiry')}
                  className="w-full"
                >
                  <DollarSign size={16} className="mr-2" />
                  💰 BALANCE INQUIRY
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('cash_withdrawal')}
                  className="w-full"
                >
                  💵 CASH WITHDRAWAL
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('pin_change')}
                  className="w-full"
                >
                  <Lock size={16} className="mr-2" />
                  🔒 CHANGE PIN
                </ATMButton>
                
                <ATMButton 
                  onClick={() => setCurrentScreen('transaction_history')}
                  variant="secondary"
                  className="w-full"
                >
                  <History size={16} className="mr-2" />
                  📋 TRANSACTION HISTORY
                </ATMButton>
                
                <ATMButton 
                  onClick={resetSession}
                  variant="danger"
                  className="w-full"
                >
                  🚪 LOG OUT
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'balance_inquiry':
        return (
          <ATMScreen title="BALANCE INQUIRY">
            <div className="text-center space-y-6">
              <DollarSign size={64} className="mx-auto text-green-400 mb-4" />
              
              <div className="bg-gray-800 p-6 rounded-lg border border-green-500/30">
                <p className="text-green-300 text-lg mb-2">Current Balance</p>
                <p className="text-green-400 text-4xl font-bold">
                  ${currentAccount?.balance.toFixed(2)}
                </p>
                <p className="text-green-600 text-sm mt-2">
                  Account: {currentAccount?.holderName}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-green-600 text-sm">
                    Card: {showFullCardNumber ? currentAccount?.cardNumber : `****${currentAccount?.cardNumber.slice(-4)}`}
                  </p>
                  <button
                    onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {showFullCardNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              
              <ATMButton 
                onClick={() => setCurrentScreen('main_menu')}
                className="w-full"
              >
                <ArrowLeft size={16} className="mr-2" />
                BACK TO MENU
              </ATMButton>
            </div>
          </ATMScreen>
        );

      case 'cash_withdrawal':
        return (
          <ATMScreen title="CASH WITHDRAWAL">
            <div className="space-y-6">
              <div className="text-center mb-6 bg-gray-800 p-4 rounded-lg border border-green-500/30">
                <p className="text-green-300">Available Balance</p>
                <p className="text-green-400 text-2xl font-bold">${currentAccount?.balance.toFixed(2)}</p>
              </div>
              
              <div>
                <label className="block text-green-300 mb-2 font-semibold">Withdrawal Amount:</label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-800 border-2 border-green-500/30 rounded-md px-4 py-3 text-green-400 placeholder-green-600 focus:outline-none focus:border-green-500 font-mono text-center text-xl"
                  min="1"
                  max={currentAccount?.balance}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[20, 40, 60, 100, 200, 500].map((amount) => (
                  <ATMButton
                    key={amount}
                    onClick={() => setWithdrawalAmount(amount.toString())}
                    variant="secondary"
                    disabled={(currentAccount?.balance || 0) < amount}
                  >
                    ${amount}
                  </ATMButton>
                ))}
              </div>
              
              <div className="space-y-4">
                <ATMButton 
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
                  className="w-full"
                >
                  💵 WITHDRAW CASH
                </ATMButton>
                
                <ATMButton 
                  onClick={() => {
                    setWithdrawalAmount('');
                    setCurrentScreen('main_menu');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  CANCEL
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'pin_change':
        return (
          <ATMScreen title="CHANGE PIN">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Lock size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-green-300">Create a new 4-digit PIN</p>
                <p className="text-green-600 text-sm mt-1">Make sure it's something you'll remember</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-green-300 mb-2 font-semibold">New PIN:</label>
                  <PinInput
                    value={newPin}
                    onChange={setNewPin}
                    placeholder="Enter new PIN"
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 mb-2 font-semibold">Confirm PIN:</label>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    placeholder="Confirm new PIN"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <ATMButton 
                  onClick={handlePinChange}
                  disabled={newPin.length !== 4 || confirmPin.length !== 4 || newPin !== confirmPin}
                  className="w-full"
                >
                  🔒 CHANGE PIN
                </ATMButton>
                
                <ATMButton 
                  onClick={() => {
                    setNewPin('');
                    setConfirmPin('');
                    setCurrentScreen('main_menu');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  CANCEL
                </ATMButton>
              </div>
            </div>
          </ATMScreen>
        );

      case 'transaction_history':
        const transactions = getAccountTransactions();
        return (
          <ATMScreen title="TRANSACTION HISTORY">
            <div className="space-y-6">
              <div className="max-h-80 overflow-y-auto space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History size={48} className="mx-auto text-green-600 mb-4" />
                    <p className="text-green-300">No transactions found</p>
                    <p className="text-green-600 text-sm">Your transaction history will appear here</p>
                  </div>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="bg-gray-800 p-4 rounded border border-green-500/30 hover:border-green-500/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-green-400 font-semibold">{transaction.description}</p>
                          <p className="text-green-600 text-sm">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {transaction.amount && (
                          <p className={`font-bold text-lg ${
                            transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <ATMButton 
                onClick={() => setCurrentScreen('main_menu')}
                className="w-full"
              >
                <ArrowLeft size={16} className="mr-2" />
                BACK TO MENU
              </ATMButton>
            </div>
          </ATMScreen>
        );

      default:
        return (
          <ATMScreen title="ERROR">
            <div className="text-center">
              <p className="text-red-400 mb-4">Unknown screen state</p>
              <ATMButton onClick={resetSession}>RESTART</ATMButton>
            </div>
          </ATMScreen>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">🏧 VIRTUAL ATM</h1>
          <p className="text-green-600 text-sm">Secure Banking System </p>
          <div className="mt-2 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        {renderScreen()}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs font-mono">
            © 2025 Virtual Bank - Simulation Only | Secure & Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
