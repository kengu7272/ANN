// Register page
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    email: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [registrationStatus, setRegistrationStatus] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      username: event.target.value, // Update username
    }));
  };
  
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      email: event.target.value, // Update email
    }));
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      password: event.target.value, // Setting password in formData
    }));
    setPasswordsMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setPasswordsMatch(formData.password === event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (formData.password === confirmPassword) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.status == 201) {
          console.log(response.status);
          setRegistrationStatus('success');
          setRegistrationMessage('Registration successful.');
        }
        else {
          setRegistrationStatus('failure');
          setRegistrationMessage(data.error);
        }
      } 
      catch (error) {
        setRegistrationStatus('failure');
        setRegistrationMessage('Network or server error. Please try again.');
      }
    } else {
      setRegistrationStatus('failure');
      setRegistrationMessage('Passwords do not match');
    }
  };

  return (
    <div className="bgImage h-full w-full flex justify-center items-center">
      <main className="bg-neutral-900 border-2 flex h-4/5 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[90%] laptop:w-1/2">
        <form className="bg-transparent flex flex-col gap-8 h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]" onSubmit={handleSubmit}>
          <label className="text-3xl tablet:text-4xl">Register</label>
          <input required type="text" placeholder="Username" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.username} onChange={handleUsernameChange}/>
          <input required type="text" placeholder="Email" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.email} onChange={handleEmailChange}/>
          <input required type="password" placeholder="Password" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.password} onChange={handlePasswordChange} />
          <input required type="password" placeholder="Confirm Password" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" onChange={handleConfirmPasswordChange} />
          {!passwordsMatch ? <div className="text-red-500">Passwords do not match</div> : null}
          {registrationStatus === 'success' && (
            <div className="text-green-500">{registrationMessage}</div>
          )}
          {registrationStatus === 'failure' && (
            <div className="text-red-500">{registrationMessage}</div>
          )}
          <input type="submit" value="Register" className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 h-1/6 mx-2 rounded-xl w-1/2" disabled={!passwordsMatch} />
        </form>
      </main>
    </div>
  );
}