import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import './css/registration.css'; // Import the custom CSS

function Registration() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        const formDetails = JSON.stringify({
            username,
            password,
            full_name: fullName,
            email,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            city,
            country,
            phone_number: phoneNumber
        });

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formDetails,
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/signin'), 2000); // Redirect after successful registration
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Registration failed!');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <form onSubmit={handleRegistration} className="shadow p-4 border rounded bg-light registration">
                        <h2 className="text-center">Register</h2>
                        {step === 1 ? (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name:</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        className="form-control"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="button" className="btn btn-light" onClick={() => navigate('/')}>
                                        Back to Login
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name:</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth:</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        className="form-control"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City:</label>
                                    <input
                                        type="text"
                                        id="city"
                                        className="form-control"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="country" className="form-label">Country:</label>
                                    <input
                                        type="text"
                                        id="country"
                                        className="form-control"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        className="form-control"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="button" className="btn btn-light" onClick={() => setStep(1)}>
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}

                        {error && <div className="text-danger mt-3">{error}</div>}
                        {success && <div className="text-success mt-3">Registration successful!</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;
