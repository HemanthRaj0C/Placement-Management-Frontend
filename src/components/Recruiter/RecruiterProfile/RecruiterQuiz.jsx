import React, { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Input, 
    Button, 
    Textarea,
    Select, 
    SelectItem,
    Divider
} from '@nextui-org/react';
import axios from 'axios';
import { IoIosCreate } from 'react-icons/io';

const RecruiterQuiz = ({ jobs = [], token, setIsAddingQuiz }) => {
    const [selectedJob, setSelectedJob] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([
        { 
            questionText: '', 
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            points: 1
        }
    ]);
    const [passingPercentage, setPassingPercentage] = useState(50);

    const addQuestion = () => {
        setQuestions([
            ...questions, 
            { 
                questionText: '', 
                options: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ],
                points: 1
            }
        ]);
    };

    const removeQuestion = (indexToRemove) => {
        // Prevent removing the last question
        if (questions.length > 1) {
            setQuestions(questions.filter((_, index) => index !== indexToRemove));
        }
    };

    const updateQuestion = (questionIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex][field] = value;
        
        // Ensure only one option is correct
        if (field === 'isCorrect' && value === true) {
            newQuestions[questionIndex].options = newQuestions[questionIndex].options.map((opt, idx) => ({
                ...opt,
                isCorrect: idx === optionIndex
            }));
        }

        setQuestions(newQuestions);
    };

    const handleSubmitQuiz = async () => {
        // Validate all required fields
        if (!selectedJob) {
            alert('Please select a job');
            return;
        }

        if (!quizTitle.trim()) {
            alert('Please enter a quiz title');
            return;
        }

        if (passingPercentage < 0 || passingPercentage > 100) {
            alert('Passing percentage must be between 0 and 100');
            return;
        }

        // Validate questions
        const isValidQuestions = questions.every(question => {
            // Check if question text is not empty
            if (!question.questionText.trim()) {
                alert('All questions must have a question text');
                return false;
            }

            // Check if at least one option is not empty
            const hasValidOptions = question.options.some(opt => opt.text.trim() !== '');
            if (!hasValidOptions) {
                alert('Each question must have at least one option');
                return false;
            }

            // Check if exactly one option is marked as correct
            const correctOptions = question.options.filter(opt => opt.isCorrect);
            if (correctOptions.length !== 1) {
                alert('Each question must have exactly one correct option');
                return false;
            }

            return true;
        });

        if (!isValidQuestions) {
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3001/api/createQuiz', 
                { 
                    jobID: selectedJob, 
                    quizTitle, 
                    questions, 
                    passingPercentage 
                },
                { headers: { recruiterToken: token } }
            );

            alert(response.data.message);
            setIsAddingQuiz(false);
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert(error.response?.data?.message || 'Failed to create quiz');
        }
    };

    return (
        <Card className="bg-amber-900 border border-amber-500/20 max-w-xl ml-9">
            <CardHeader className="bg-amber-950/50 gap-2 py-4 px-6">
                <IoIosCreate className="text-3xl text-orange-400" />
                <h2 className="text-2xl font-semibold text-white">Create Quiz</h2>
            </CardHeader>
            <Divider className="bg-amber-500/20" />
            <CardBody className="space-y-4 p-6">
                <Select
                    label="Select Job"
                    value={selectedJob}
                    onSelectionChange={(keys) => setSelectedJob(Array.from(keys)[0])}
                    isRequired
                >
                    {jobs.map((job) => (
                        <SelectItem key={job.jobID} value={job.jobID}
                        textValue={`${job.jobTitle} - ${job.companyName}`}
                        >
                            {job.jobTitle} - {job.companyName}
                        </SelectItem>
                    ))}
                </Select>

                <Input 
                    label="Quiz Title" 
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    isRequired
                />

                <Input 
                    label="Passing Percentage" 
                    type="number"
                    value={passingPercentage}
                    onChange={(e) => setPassingPercentage(Number(e.target.value))}
                    isRequired
                    min={0}
                    max={100}
                />

                {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="bg-amber-800 p-4 space-y-2 relative">
                        {questions.length > 1 && (
                            <Button 
                                color="danger" 
                                size="sm" 
                                className="absolute top-2 right-2 z-10"
                                onClick={() => removeQuestion(qIndex)}
                            >
                                Remove Question
                            </Button>
                        )}
                        <Textarea 
                            label={`Question ${qIndex + 1}`}
                            value={question.questionText}
                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                            isRequired
                        />
                        
                        {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2 max-w-sm">
                                <Input 
                                    label={`Option ${oIndex + 1}`}
                                    value={option.text}
                                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                    isRequired
                                />
                                <input 
                                    type="checkbox" 
                                    checked={option.isCorrect}
                                    className='w-6 h-6'
                                    onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                />
                            </div>
                        ))}
                    </Card>
                ))}

                <div className="flex space-x-4">
                    <Button onClick={handleSubmitQuiz} color="primary">
                        Create Quiz
                    </Button>
                    <Button onClick={addQuestion} color="secondary">
                        Add Question
                    </Button>
                    <Button onClick={()=>{setIsAddingQuiz(false)}} color="danger">
                        Cancel
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default RecruiterQuiz;