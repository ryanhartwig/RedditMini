import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import { BiAddToQueue } from 'react-icons/bi';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { Subreddit } from '../../types';
import srdefault from '../../images/srdefault.jpeg';
import { toggleResult, toggleSubreddit } from '../../app/reducers/subredditsSlice';
import clsx from 'clsx';
export interface SubProps {
  sub: Subreddit;
  result?: boolean;
}

export type size = '' | '0';

export const Sub = ({sub, result}: SubProps) => {
  const dispatch = useAppDispatch();
  
  const { subs } = useAppSelector((state) => state.subreddits);

  const [size, setSize] = useState<size>('');
  const toggleQueue = useAppSelector((s) => s.subreddits.toggleQueue)

  const add = useMemo(() => {
    let willAdd = !subs.some((s) => s.name === sub.name);
    return result && toggleQueue.some((s) => s.name === sub.name) ? !willAdd : willAdd;
  }, [result, sub.name, subs, toggleQueue]);

  const onClick = useCallback(() => {
    if (result) {
      dispatch(toggleResult(sub));
      // setAdd((p) => !p);
    } else {
      setSize('0');
      setTimeout(() => {
        dispatch(toggleSubreddit(sub));
      }, 180);
    }
  }, [dispatch, result, sub])

  return (
    <div onClick={onClick} style={{height: size, width: size}} className={clsx('sub', {'result': result}, {'add': add})}>
      <div style={{display: 'flex', maxWidth: '80%'}}>
        <img className='sr-icon' src={sub.iconUrl || srdefault} alt="" />
        <p style={{overflow: 'hidden'}}><span style={{color: 'grey', marginLeft: '7px'}}>r/</span>{sub.name}</p>
      </div>
      <button className="remove-sub">
        { add
          ? <BiAddToQueue className={'toggle-icon'} />
          : <CiTrash className={'toggle-icon'} />
        }
      </button>
    </div>
  );
}