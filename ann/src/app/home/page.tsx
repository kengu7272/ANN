// Home page
"use client";

import Navbar from '../components/navbar';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

interface ResponseData {
  status: number,
  error: string,
  message: string,
  question: string,
  answer: string,
  video: string
  
}

export default function Home() {
  const [question, setQuestion] = useState<ResponseData | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false); // New state for video visibility
  const router = useRouter();

  const getQuestion = async (token: string) => {
    try {
      const response = await fetch('/api/home', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      const data = await response.json() as ResponseData;

      if (data.status >= 200 && data.status < 300) {
        setQuestion(data);
      } else {
        console.error('Error fetching question:', data.error);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const extractVideoId = (videoLink: string) => {
    // Extract the video ID from the YouTube link
    const videoIdMatch = videoLink.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoIdMatch ? videoIdMatch[1] : '';
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (question) {
      const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
      setResult(isCorrect ? "Correct!" : "Wrong answer. Try again.");

      // Set the visibility of the video when the result is correct
      setShowVideo(isCorrect);
    }
  };

  const loadNewQuestion = () => {
    setUserAnswer(""); // Reset user's answer
    setResult(null); // Reset result
    setShowVideo(false); // Reset video visibility
    const getToken: string | null = sessionStorage.getItem('token');
    if (getToken) {
      getQuestion(getToken);
    }
  };

  const handleLoadNewQuestionClick = () => {
    loadNewQuestion();
  };

  useEffect(() => {
    const getToken: string | null = sessionStorage.getItem('token');
    if (!getToken) {
      router.push('/login');
      return;
    }

    getQuestion(getToken);
  }, []);

  return (
    <div className="h-[1000px] max-h-[1000px] w-full flex justify-center items-center">
      <Navbar />
      <main className="bg-neutral-900 border-2 flex h-3/5 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[90%] laptop:w-1/2">
        <form
          onSubmit={handleSubmit}
          className="bg-transparent flex flex-col gap-4 h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]"
        >
          <label className="text-3xl tablet:text-4xl mt-5">Music Trivia</label>
          {/* Display the question and user input */}
          {question && (
            <>
              <p>{question.question}</p>
              <input
                required
                type="text"
                placeholder="Answer"
                value={userAnswer}
                onChange={handleAnswerChange}
                className="h-[10%] p-2 rounded-xl text-neutral-900 w-4/5"
              />
              <div className="flex flex-row justify-center mx-2 w-1/2">
                <input
                  type="submit"
                  value="Submit"
                  className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 mx-2 rounded-xl px-5 py-2"
                />
                <button
                  onClick={handleLoadNewQuestionClick}
                  className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 mx-2 rounded-xl px-5 py-2"
                >
                  →
                </button>
              </div>
              {/* Display the result */}
              {result && result === "Correct!" && <p className="text-green-500">{result}</p>}
              {result && result === "Wrong answer. Try again." && <p className="text-red-500">{result}</p>}
              {/* Embed the YouTube video when the result is correct and showVideo is true */}
              {showVideo && (
                <iframe className="tablet:max-w-[400px] max-w-[300px] tablet:min-h-[200px] mb-5"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractVideoId(question.video)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </>
          )}
        </form>
      </main>
    </div>
  );
}
