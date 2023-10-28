import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import axios from 'axios';
import './CSS FIles/TransactionDetails.css'; 

interface Product {
    productid: number;
    productname: string;
    quantity: number;
    price: number;
}

interface TransactionDetails {
    transactionid: number;
    total_quantity: number;
    total_price: number;
    tendered_bill: number;
    balance: number;
    customer_name: string;
    customer_num: string;
    customer_email: string;
    date_time: string;
    refunded: boolean;
    returned: boolean;
}

const TransactionDetails = () => {
    const { id } = useParams();
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>();
    const [products, setProducts] = useState<Product[]>([]);
    const [refunded, setRefunded] = useState(false);
    const [returned, setReturned] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        // Fetch transaction details using the provided URL
        axios.get(`http://localhost:8080/transaction/getByTransaction?transactionid=${id}`)
            .then((response) => {
                console.log(response.data); // Log the response data
                const responseData: TransactionDetails = response.data;
                setTransactionDetails(responseData);
            })
            .catch((error) => {
                console.error(error);
            });

        // Fetch products related to this transaction
        axios.get(`http://localhost:8080/transaction/${id}/products`)
            .then((response) => {
                const responseData: Product[] = response.data;
                setProducts(responseData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);


    // const handleLogin = () => {
    //     // Create a request object with the username and password
    //     const loginRequest = {
    //       username: username,
    //       password: password,
    //     };
    
    //     // Check if the username and password are not empty
    //     if (!loginRequest.username || !loginRequest.password) {
    //       window.alert('Please enter both your username and password');
    //     } else {
    //       // Send a POST request to the server
    //       axios.post('http://localhost:8080/user/loginad', loginRequest)
    //         .then((response) => {
    //           if (response.status === 200) {
    //           } else {
    //             window.alert('Please enter your username and password');
    //           }
    //         })
    //         .catch((error) => {
    //           console.error('Login failed:', error);
    //           window.alert('The username or password you’ve entered is incorrect. Please try again.');
    //         });
    //       }   
    //   };

    const handleRefundClick = () => {
        const confirmed = window.confirm('Are you sure you want to refund?');
        if (confirmed) {
            setRefunded(true);
            axios.put(`http://localhost:8080/transaction/putTransaction?transactionid=${id}`, { refunded: true })
              .then((response) => {
                  window.confirm(`Transaction ${id} has been refunded.`);
                  console.log('Refund successful:', response.data); // Log a success message
              })
              .catch((error) => {
                  console.error(error);
                  window.alert(`Failed to refund transaction ${id}.`);
              });
        }
    };

    const handleReturnClick = () => {
        const confirmed = window.confirm('Are you sure you want to return item?');
        if (confirmed) {
            setReturned(true);
            axios.put(`http://localhost:8080/transaction/putTransaction?transactionid=${id}`, { returned: true })
              .then((response) => {
                  window.confirm(`Transaction ${id} has been returned.`);
                  console.log('Return successful:', response.data); // Log a success message
              })
              .catch((error) => {
                  console.error(error);
                  window.alert(`Failed to return transaction ${id}.`);
              });
        }
    };
    
    return (
        <div className='table-container'>
            <div className='table'>
            <h2>Transaction Details</h2>
            {transactionDetails && (
                <table>
                    <tbody>
                        <tr>
                            <th>Transaction ID</th>
                            <td style={{fontWeight: 'bold', color: 'green'}}>{transactionDetails.transactionid}</td>
                        </tr>
                        <tr>
                            <th>Total Quantity</th>
                            <td>{transactionDetails.total_quantity}</td>
                        </tr>
                        <tr>
                            <th>Total Price</th>
                            <td>{transactionDetails.total_price.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Tendered Bill</th>
                            <td>{transactionDetails.tendered_bill.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Balance</th>
                            <td>{transactionDetails.balance.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Customer Name</th>
                            <td>{transactionDetails.customer_name}</td>
                        </tr>
                        <tr>
                            <th>Customer Number</th>
                            <td>{transactionDetails.customer_num}</td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>{transactionDetails.customer_email}</td>
                        </tr>
                        <tr>
                            <th>Date & Time</th>
                            <td>{transactionDetails.date_time}</td>
                        </tr>
                        <tr>
                            <th>Refunded</th>
                            <td>{transactionDetails.refunded ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Returned</th>
                            <td>{transactionDetails.returned ? 'Yes' : 'No'}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            </div>
            <div className='table'>
            <h2>Products Purchased</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productid}>
                            <td style={{fontWeight: 'bold', color: 'red'}}>{product.productid}</td>
                            <td>{product.productname}</td>
                            <td>{product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="buttons-container">
            <button className="refund-button" onClick={handleRefundClick}>
            Refund
          </button>
                    <button className="return-button" onClick={handleReturnClick}>Return</button>
                </div>
        </div>
        </div>
    );
};

export default TransactionDetails;
