import { Button } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';


export default function CashierMainPage() {
    <title>Cashiering</title>
    return (
        <div className='center-bod' style={{backgroundColor: '#DDDDDD'}}>
            <div className="button-container">
                <Link to="/cashiering"><button className='button1'>Perform Transaction</button></Link>
                <br></br>
                <Link to="/transaction-history"><button className='button2'>Transaction History</button></Link>
            </div>
        </div>
    );
    }