import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const navigate = useNavigate();

    const validateFrom = () => {
        if(!username||!password){
            setError('Username and password are required');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!validateFrom()) return;
        setLoading(true);

        const fromDetails = new URLSearchParams();
        fromDetails.append('username', username);
        fromDetails.append('password', password);

        try{
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-from-rlencoded', 
                },
                body: fromDetails,
            });

            setLoading(false);

            if(response.ok){
                const data= await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/protected');
            }else{
                const errorData = await response.json();
                setError(errorData.detail || 'Authentication failed!');
            }
        } catch (error){
            setLoading(false);
            setError('An error occurred. Please try again later.');
        }
    };

    return(
        <div>
            <from onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in ...' : 'Login'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p> }
            </from>
        </div>
    );
}