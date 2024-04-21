// src/components/JobsPage.tsx
import React from 'react';
import { useGetJobsQuery } from '../services/apiService';

const JobsPage: React.FC = () => {
    const { data: jobs, error, isLoading } = useGetJobsQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading jobs.</div>;

    return (
        <div>
            <h1>Jobs</h1>
            <ul>
                {jobs?.map(job => (
                    <li key={job.id}>{job.title} - {job.description}</li>
                ))}
            </ul>
        </div>
    );
}

export default JobsPage;
