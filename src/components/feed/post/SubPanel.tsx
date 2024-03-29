import { SubMeta } from '../../../types';
import './SubPanel.css';
import defaultIcon from '../../../media/srdefault.jpeg';
import { getScore } from '../../../utility/getScore';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/hooks';
import { toggleBlocked, toggleSubreddit } from '../../../app/reducers/subredditsSlice';
import { selectTheme } from '../../../app/reducers/savedSlice';
import { getRGBA } from '../../../utility/getRGBA';

interface SubPanelProps {
  open: boolean,
  data: SubMeta | undefined,
  name: string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const SubPanel = ({open, data, name, setOpen}: SubPanelProps) => {
  const dispatch = useAppDispatch();
  
  const imageSrc = data?.banner_img || data?.header_img || '';

  const followed = useAppSelector(s => s.subreddits.in_storage.subs).some((s) => s.name === name);
const theme = useAppSelector(selectTheme);
  const borderColor = getRGBA(theme.border);
  const background = getRGBA(theme.front);
  const backAlt = getRGBA(theme.back_alt);
  
  const onToggleFollow = useCallback(() => {
    const sub = {
      name,
      icon_url: data!.community_icon,
      is_valid: true,
    }

    dispatch(toggleSubreddit(sub))
  }, [data, dispatch, name]);

  const onBlock = useCallback(() => {
    setOpen(false);
    dispatch(toggleBlocked({
      name,
      icon_url: '',
      is_valid: true,
    }));
  }, [dispatch, name, setOpen]);
  
  return data ? (
    <div className='sub-details-panel' style={{background, borderColor, display: open ? '' : 'none'}}>
      {imageSrc && <div className='sub-details-banner'>
        <img src={imageSrc} alt="subreddit banner"></img>
      </div> }
      <div className='sub-details-sub'>
        <img className='post-sub-img' src={data.community_icon || data.icon_img || defaultIcon} alt='subreddit icon'></img>
        <h3><span className='name-prefix'>r/</span>{name}</h3>
      </div>
      <div className='sub-activity'>
        <p>{getScore(data.subscribers)} members</p>
        <p>{getScore(data.active_user_count)} online</p>
      </div>
      <hr></hr>
      <p className='sub-desc'>{data.public_description}</p>
      <div className='sub-details-actions'>
        <div style={{background: backAlt}} className='sub-details-button' onClick={onToggleFollow}><p>{followed ? 'Unfollow' : 'Follow'}</p></div>
        <div style={{background: backAlt}} className='sub-details-button' onClick={onBlock}><p>Block Community</p></div>
      </div>
    </div>
  ) : <></>
}