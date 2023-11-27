// Home page
"use client";

import Navbar from '../components/navbar';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

interface Question {
    question: string;
    answer: string;
}

export default function Home() {
    const [token, setToken] = useState('');
    const [question, setQuestion] = useState<string | null>(null);
    const router = useRouter();

    const getQuestion = async () => {
        try {
            const response = await fetch('/api/home', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            const data = await response.json();

            if (response.ok) {
                setQuestion(data.question);
            } else {
                // Handle error
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            router.push("/login");
            return;
        }

        setToken(token);

        // send request to get trivia question when visiting page
        void getQuestion();
    }, []);

    return (
        <div className="h-full w-full flex justify-center items-center">
            <Navbar />
            <main className="bg-neutral-900 border-2 flex h-3/4 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[90%] laptop:w-1/2">
                <form className="bg-transparent flex flex-col gap-8 h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]">
                    <label className="text-3xl tablet:text-4xl">Music Trivia</label>
                    <p className="">{question ? `What artist wrote ${question}?` : 'Loading question...'}</p>
                    <input required type="text" placeholder="Answer" className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5" />
                    <input type="submit" value="Submit" className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 h-1/6 mx-2 rounded-xl w-1/2" />
                </form>
            </main>
        </div>
    )
}
