import React, { useState } from 'react';
import { MdOutlineSearch } from "react-icons/md";
import { useDebouncedCallback } from 'use-debounce';
import styles from './search.module.css';

interface SearchProps {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = useDebouncedCallback((value: string) => {
        onSearch(value);
    }, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    return (
        <div className={styles.search}>
            <MdOutlineSearch size={20} />
            <input
                type="text"
                placeholder="Search..."
                className={styles.input}
                value={query}
                onChange={handleChange}
                onFocus={() => console.log('Input focused')}
                onBlur={() => console.log('Input blurred')}
            />
        </div>
    );
};

export default Search;
