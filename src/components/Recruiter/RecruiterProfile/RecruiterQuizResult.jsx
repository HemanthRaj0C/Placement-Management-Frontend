import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardBody, 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Chip 
} from '@nextui-org/react';
import axios from 'axios';

const RecruiterQuizResult = ({ job }) => {
    const [quizResults, setQuizResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchQuizResults = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `http://backend:3001/api/quizResults/${job.jobID}`, 
                    { 
                        headers: { 
                            recruiterToken: localStorage.getItem("recruiterToken") 
                        } 
                    }
                );
                setQuizResults(response.data);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
                alert('Failed to load quiz results');
            }
            setIsLoading(false);
        };

        if (job.jobID) {
            fetchQuizResults();
        }
    }, [job.jobID]);

    const getStatusChipColor = (passed) => {
        return passed ? 'success' : 'danger';
    };

    if (isLoading) {
        return <div className="text-white text-center">Loading quiz results...</div>;
    }

    return (
        <Card className="bg-amber-900 border border-amber-500/20 shadow-lg">
            <CardBody className="p-6">
                {quizResults.length === 0 ? (
                    <p className="text-white text-center">No quiz results yet.</p>
                ) : (
                    <Table 
                        aria-label="Quiz Results" 
                        className="table-auto border-separate border-spacing-y-3 text-white"
                    >
                        <TableHeader className="">
                            <TableColumn className="px-4 py-2 bg-amber-800 text-white">Candidate</TableColumn>
                            <TableColumn className="px-4 py-2 bg-amber-800 text-white">Score</TableColumn>
                            <TableColumn className="px-4 py-2 bg-amber-800 text-white">Status</TableColumn>
                            <TableColumn className="px-4 py-2 bg-amber-800 text-white">Date</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {quizResults.map((result, index) => (
                                <TableRow 
                                    key={index} 
                                    className="text-gray-800 transition-colors"
                                >
                                    <TableCell className="px-4 py-2">{result.studentName}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {result.score}/{result.totalMarks} 
                                        ({result.percentage.toFixed(2)}%)
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <Chip 
                                            color={getStatusChipColor(result.passed)}
                                            size="sm"
                                            className={`text-xs font-medium px-3 ${
                                                result.passed ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {result.passed ? 'Passed' : 'Failed'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {new Date(result.submittedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
};

export default RecruiterQuizResult;
