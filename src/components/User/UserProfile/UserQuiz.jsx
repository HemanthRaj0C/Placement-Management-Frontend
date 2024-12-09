import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Radio, 
    RadioGroup,
    ScrollShadow
} from '@nextui-org/react';
import axios from 'axios';
import { HiQuestionMarkCircle } from "react-icons/hi";

const UserQuiz = ({ 
    isOpen, 
    onOpenChange, 
    jobID, 
    token, 
    onQuizComplete 
}) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (isOpen && jobID) {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/getQuiz/${jobID}`, 
                        { headers: { token } }
                    );
                    setQuiz(response.data);
                    // Initialize answers array with empty strings
                    setAnswers(new Array(response.data.questions.length).fill(''));
                } catch (error) {
                    console.error('Error fetching quiz:', error);
                    alert('Failed to load quiz');
                }
            }
        };

        fetchQuiz();
    }, [isOpen, jobID, token]);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = selectedOption;
        setAnswers(newAnswers);
    };

    const submitQuiz = async () => {
        // Validate all questions are answered
        const unansweredQuestions = answers.findIndex(answer => !answer);
        if (unansweredQuestions !== -1) {
            alert(`Please answer all questions. Question ${unansweredQuestions + 1} is unanswered.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'http://localhost:3001/api/submitQuiz', 
                { 
                    quizID: quiz.quizID, 
                    jobID: quiz.jobID, 
                    answers 
                },
                { headers: { token } }
            );

            onQuizComplete(response.data.result);
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert(error.response?.data?.message || 'Failed to submit quiz');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!quiz) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            size="2xl"
            backdrop="blur"
            scrollBehavior="inside"
            className='bg-blue-900/50 text-white'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className='flex items-center gap-2'>
                            <HiQuestionMarkCircle className="text-2xl text-cyan-400" />
                            <h2 className="text-xl font-bold">{quiz.quizTitle}</h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                Passing Percentage: {quiz.passingPercentage}%
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <ScrollShadow>
                                {quiz.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mb-6 p-4 bg-blue-950 text-white rounded-lg">
                                        <p className="font-semibold mb-3">
                                            {questionIndex + 1}. {question.questionText} 
                                            <span className="text-sm text-default-500 ml-2">
                                                ({question.points} point{question.points !== 1 ? 's' : ''})
                                            </span>
                                        </p>
                                        <RadioGroup
                                            value={answers[questionIndex]}
                                            onValueChange={(value) => handleAnswerChange(questionIndex, value)}
                                            color="primary"
                                        >
                                            {question.options.map((option, optionIndex) => (
                                                <Radio 
                                                    key={optionIndex} 
                                                    value={option.text}
                                                    className="mb-2 bg-white text-transparent bg-clip-text"
                                                >
                                                    <p className='text-white'>{option.text}</p>
                                                </Radio>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                ))}
                            </ScrollShadow>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="danger" 
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                color="success" 
                                onPress={submitQuiz}
                                isLoading={isSubmitting}
                            >
                                Submit Quiz
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UserQuiz;