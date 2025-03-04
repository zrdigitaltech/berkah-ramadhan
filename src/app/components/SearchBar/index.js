'use client';

import React, { useState, useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';

const SearchBar = (props) => {
  const { value, onChange, onSubmit } = props;

  const texts = [
    'K',
    'Ke',
    'Ket',
    'Keti',
    'Ketik',
    'Ketik d',
    'Ketik di',
    'Ketik dis',
    'Ketik disi',
    'Ketik disin',
    'Ketik disini ...'
  ];
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setPlaceholder(texts[index]);
      index = (index + 1) % texts.length;
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <form className="forms" onSubmit={onSubmit}>
      <div className="input-group">
        <BiSearch className="search-icon" />
        <input type="search" placeholder={placeholder} value={value} onChange={onChange} />
        <button type="submit" className="btn btn-search">
          <BiSearch color="#fff" size="1.7rem" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
