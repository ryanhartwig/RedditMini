import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { getSubreddits, toggleSubreddit } from '../app/reducers/subredditsSlice';
import { Subreddit } from '../types';
import './SearchResults.css';
import { Sub } from './sub/Sub';

interface SearchResultsProps {
  /**
   * Represents whether or not the search results are currently showing
   */
  inSearch: boolean;
  setInSearch: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Actual query used to fetch after a one second debounce
   */
  searchQuery: string;
  /**
   * Text in the input field, to be queried
   */
  searchInput: string;
}

export const SearchResults = ({inSearch, setInSearch, searchQuery, searchInput}:SearchResultsProps) => {
  const dispatch = useAppDispatch();
  const {searchResults: results, searchStatus, subs} = useAppSelector((state) => state.subreddits);

  const [toggled, setToggled] = useState<Subreddit[]>([]);

  // Search subreddits
  useEffect(() => {
    dispatch(getSubreddits(searchQuery));
  }, [searchQuery, dispatch]);

  // Reset selected subs when closing search results or changing searchquery
  useEffect(() => {
    setToggled([]);
  }, [inSearch, searchQuery]);

  const onClick = useCallback((sub: Subreddit) => {
    setToggled((p) => {
      let index = p.findIndex((sr) => sr.name === sub.name);

      if (index === -1) return [...p, sub]
      else return p.slice(0, index).concat(p.slice(index + 1));
    })
  }, []);

  // Submit / save new subs
  const setSubs = useCallback(() => {
    toggled.forEach((sub) => {
      dispatch(toggleSubreddit(sub));
    })
    setInSearch(false);
    setToggled([]);
  }, [dispatch, setInSearch, toggled]);

  return (
    <>
      {inSearch && (
        <div className="search-results">
          {
          searchInput.length < 3 
            ? <p>Enter a search of at least 3 characters.</p>
            : searchStatus === 'idle' && results.length
              ? <>
                {results.map((result: Subreddit) => 
                (<div key={`sub-${result.name}`} 
                      onClick={() => onClick(result)}
                      id={`result-${result.name}`} 
                      style={{width: '100%'}} 
                      className={clsx('sub', {'add': !(subs.some((sub) => sub.name === result.name))})}>
                    <Sub key={result.name} sub={result} clicked={false} toggled={toggled} />
                  </div>))}
                <div className='save-wrapper'>
                  <input type='button' onClick={() => setSubs()} className='save-results' value='Save'></input>
                </div>
              </>
              : searchStatus === 'loading'
                ? <p>Loading...</p>
                : <p>No results found.</p>
          }
        </div>
      )}
    </>
    
  )
}