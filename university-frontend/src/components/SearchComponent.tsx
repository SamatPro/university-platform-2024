import React, { useState } from 'react';

export const SearchComponent = () => {
    const [text, setText] = useState('');
    const [vacancies, setVacancies] = useState('');

    const searchVacancies = async () => {
        const response = await fetch(`/search?text=${text}`);
        const data = await response.text();
        setVacancies(data);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={searchVacancies}>Search</button>
            <div>{vacancies}</div>
        </div>
    );
};