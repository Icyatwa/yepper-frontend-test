import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={styles.container}>
            <Link to='/PaymentSettingsForm' style={styles.button}>Payment Settings Form</Link>
            <Link to='/PaymentForm' style={styles.button}>Payment Form</Link>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // This centers the buttons vertically
        gap: '20px' // Adds space between the buttons
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#6200ea', // Example color, you can customize
        color: '#fff'
    }
};

export default Home;
