import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CSS FIles/TransactionHistory.css';
import './CSS FIles//Images Cashierieng/ViewIcon.png'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AccountLoginValid/AuthContext';


interface Transaction {
    transactionid: number;
    date_time: string;
}

const TransactionHistory = () => {

    const { isCashierLoggedIn } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      // Check for a valid JWT token on page load
      const token = localStorage.getItem('cashierToken');
  
      if (!token) {
        // Redirect to the login page if there's no token
        navigate('/logincashier');
      } else {
        // Verify the token on the server, handle token expiration, etc.
        // If token is valid, setIsCashierLoggedIn(true)
      }
    }, [isCashierLoggedIn, navigate]);

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/transaction/getAllTransaction')
            .then((response) => {
                setTransactions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleDeleteTransaction = (id: number) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
  
      if (confirmDelete) {
          axios.delete(`http://localhost:8080/transaction/deleteTransaction/${id}`)
              .then(() => {
                  // Display a window.confirm message after successful deletion
                  const success = window.confirm("Transaction has been deleted.");
                  if (success) {
                      setTransactions((prevTransactions) =>
                          prevTransactions.filter((transaction) => transaction.transactionid !== id)
                      );
                  }
              })
              .catch((error) => {
                  console.error(error);
              });
      }
  };

    const [searchInput, setSearchInput] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const handleSearch = (searchValue: string) => {
        setSearchInput(searchValue);
        const filtered = transactions.filter((transaction) =>
            String(transaction.transactionid).includes(searchValue)
        );
        setFilteredTransactions(filtered);
    };

    return (
        <div className="transaction-container">
            <div style={{ display: 'flex', color: '#213458', marginBottom: 50}}>
                <h1 style={{fontSize: 30,marginLeft: '50px', marginBottom: '10px', marginTop: '30px', fontWeight: 'bolder' }}>All Transactions</h1>
                <input
                    type="text"
                    placeholder="Search Transaction ID"
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ 
                        marginLeft: '1000px', 
                        marginTop: '20px',
                        marginRight: '20px',
                        height: '40px',
                        padding: '10px',
                        fontSize: '16px',
                        fontWeight: 'bolder'
                    }}
                />
            </div>
            
            <div className="transaction-table-container">      
            {searchInput && filteredTransactions.length === 0 ? (
                <p style={{ marginTop: '100px', textAlign: 'center', fontSize: '30px' }}>No transactions found.</p>
            ) : (
                <table className="transaction-table" style={{maxWidth: '90%'}}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th style={{maxWidth:200}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchInput
                            ? filteredTransactions.map((transaction) => (
                            <tr key={transaction.transactionid}>
                                <td style={{fontWeight: 50}}>Transaction {transaction.transactionid}</td>
                                <td>
                                    <Link to={`/transactions/${transaction.transactionid}`}>
                                        View
                                    </Link>
                                    <button onClick={() => handleDeleteTransaction(transaction.transactionid)}>
                                        Delete
                                    </button>
                                </td>

                            </tr>
                            ))
                            : transactions.map((transaction) => (
                            <tr key={transaction.transactionid}>
                                <td style={{color: '#213458'}}>
                                    <div style={{fontWeight: 'bold', fontSize: 30}}> Transaction {transaction.transactionid}</div> 
                                    <div style={{fontSize: 20}}>{transaction.date_time}</div>
                                </td>
                                <td>
                                    <Link className='btn btn-success btn-lg'style={{marginRight: 5}} to={`/transactions/${transaction.transactionid}` }>
                                            View
                                    </Link>
                                    <button className='btn btn-danger btn-lg' onClick={() => handleDeleteTransaction(transaction.transactionid)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
       </div> 
    );
};

export default TransactionHistory;
