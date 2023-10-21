// Profile page
"use client";

import Navbar from "../components/navbar";
import React, { useState, ChangeEvent, FormEvent, useEffect} from 'react';
import { useRouter } from "next/navigation";

interface ProfileData {
  action: string;
  username: string;
  email: string;
  password: string;
}

export default function Register() {

  function removeToken(){
    sessionStorage.removeItem('token');
  }

  const [formData, setFormData] = useState<ProfileData>({
    action: '',
    username: '',
    email: '',
    password: ''
  });

  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
      const token = sessionStorage.getItem('token');
      if(!token) {
          router.push("/login");
          return;
      }

      setToken(token!);
  }, []);

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

    setFormData((prevData) => ({
        ...prevData,
        action: 'edit'
    }));

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : token,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if(data.status >= 200 && data.status < 300)
        {
            setRegistrationStatus('success');
            setRegistrationMessage(data.message);
        }
    } catch (error) {
            setRegistrationStatus('failure');
            setRegistrationMessage('Internal Server Error');
        }
            
    }
  
    function deleteProfile(){
        
    }
    function logOut(){
        removeToken();
        router.push('/login');
    }
    return (
        <div className="bgImage flex justify-center items-center h-full w-full">
            <Navbar />
                <div className="bg-neutral-900 border-2 flex h-1/2 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[90%] laptop:w-1/2">
                    <form className="bg-transparent flex flex-col gap-8 h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]" onSubmit={handleSubmit}>
                        <label className="text-3xl tablet:text-4xl">Edit Profile</label>
                        <input required type="text" placeholder="Username" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.username} onChange={handleUsernameChange}/>
                        <input required type="text" placeholder="Email" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.email} onChange={handleEmailChange}/>
                        <input required type="password" placeholder="Password" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" value={formData.password} onChange={handlePasswordChange} />
                        <input required type="password" placeholder="Confirm Password" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" onChange={handleConfirmPasswordChange} />
                        {!passwordsMatch ? <div className="text-red-500">Passwords do not match</div> : null}
                        {registrationStatus === 'success' && (
                            <div className="text-green-500">{registrationMessage}<span> </span><a className='underline' href="/login">Back to login</a></div>
                        )}
                        {registrationStatus === 'failure' && (
                            <div className="text-red-500">{registrationMessage}</div>
                        )}
                        {(formData.username != '' && formData.email != '' && formData.password != '' && confirmPassword != '') &&
                        (<input type="submit" value="Update Details" className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 h-1/6 mx-2 rounded-xl w-1/2" disabled={!passwordsMatch} />)}
                    </form>
                </div>
            <div>
                <button onClick={logOut} className="absolute bottom-5 right-0 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 mx-2 rounded-xl w-1/5 max-w-xs">Log Out</button>
                <button className="absolute bottom-5 left-0 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 mx-2 rounded-xl w-1/5 max-w-xs">Delete Profile</button>
            </div>
        </div>
    )
};
