import './Post.css';

import { PostType } from '../../utility';
import { Video } from './body/Video';
import { TextBody } from './body/TextBody';
import { ImageBody } from './body/ImageBody';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { save, unsave } from '../../app/reducers/savedSlice';

interface PostProps { 
  post: PostType;
  clicked?: boolean;
  saved?: boolean;
  setOpenPost?: React.Dispatch<React.SetStateAction<PostType | null>>;
}

export const Post = ({post, saved, clicked, setOpenPost}: PostProps) => {
  const dispatch = useDispatch();

  const onSave = useCallback(() => {
    if (saved) {
      dispatch(unsave(post));
    } else {
      dispatch(save(post));
    }
  }, [dispatch, post, saved]);

  useEffect(() => {
    if (clicked && setOpenPost) {
      setOpenPost(post);
    }
  }, [clicked, post, setOpenPost]);
  
  return (
    <>
      {post && (
      <article className={`post ${post.link}`}>
        {/* Subreddit & Poster Info */}
        <address>
          <p><a className='sub-link' href={`https://www.reddit.com/${post.subreddit_name_prefixed}`} rel='noreferrer' target={'_blank'}>/r/{post.subreddit}</a></p>
        </address>

        {/* Title */}
        <header className='post-title'>
          <h2>{post.title}</h2>
        </header>
        {/* Body */}
        <main className={`post-body ${post.type}`}>
          {
            post.type === 'video' ? <Video url={post.content_url}/>
            : post.type === 'image' ? <ImageBody url={post.content_url}/>
            : <TextBody selftext={post.selftext} selftext_html={post.selftext_html} />
          }
        </main>
        
        {/* Info / Actions */}
        <footer className='info'>
          <p>{post.score} score</p>
          <p>{post.num_comments} comments</p>
          <button className='info-save' onClick={onSave}>{saved ? 'Unsave' : 'Save'}</button>
        </footer>
      </article>
      )}
    </> )
}