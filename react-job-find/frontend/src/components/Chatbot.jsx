import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import Draggable from 'react-draggable';

export default function Chatbot() {
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userIssue, setUserIssue] = useState('');

    const toggleChatbot = () => {
        setChatbotVisible(!chatbotVisible);
    };

    const chatbotContainerStyle = {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.9)',
        width: '350px',
        height: '450px',
    };

    const chatButtonStyle = {
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        cursor: 'pointer',
        width: '100px',
        height: '100px',
    };

    // Animation inline styles
    const bounceAnimation = {
        animation: 'bounce 1.7s infinite',
        transition: 'transform 0.3s ease',
    };

    const imgStyle = {
        width: '100px',
        height: '100px',
        ...bounceAnimation, // Combine avec les styles d'animation
    };

    const keyframesStyle = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;

    const steps = [
        { id: '1', message: 'Hello! Welcome to our website.', trigger: '2' },
        { id: '2', message: 'What is your name?', trigger: 'userName' },
        {
            id: 'userName',
            user: true,
            trigger: '3',
            validator: (value) => {
                if (value.trim() === '') {
                    return 'Please enter a valid name!';
                }
                setUserName(value);
                return true;
            },
        },
        { id: '3', message: `Nice to meet you, {previousValue}. What is your email?`, trigger: 'userEmail' },
        {
            id: 'userEmail',
            user: true,
            validator: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email!';
                }
                setUserEmail(value);
                return true;
            },
            trigger: '4',
        },
        { id: '4', message: 'Thank you! Please describe your issue.', trigger: 'userIssue' },
        {
            id: 'userIssue',
            user: true,
            trigger: '5',
            validator: (value) => {
                if (value.trim() === '') {
                    return 'Please describe your issue!';
                }
                setUserIssue(value);
                return true;
            },
        },
        { id: '5', message: `Thank you, {previousValue}. We will contact you soon at ${userEmail}.`, end: true },
    ];

    return (
        <div>
            <style>{keyframesStyle}</style> {/* Ajout des animations CSS */}
            <div onClick={toggleChatbot} style={chatButtonStyle}>
                <img
                    src="chatbot.png"
                    alt="Chatbot"
                    style={imgStyle}
                />
            </div>
            {chatbotVisible && (
                <Draggable>
                    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
                        <div style={chatbotContainerStyle}>
                            <ChatBot steps={steps} />
                        </div>
                    </div>
                </Draggable>
            )}
        </div>
    );
}
