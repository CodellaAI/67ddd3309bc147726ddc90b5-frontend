
'use client';
import TweetComposer from './TweetComposer';

export default function CommentForm({ tweetId, onCommentAdded }) {
  return (
    <TweetComposer replyTo={tweetId} onTweetAdded={onCommentAdded} />
  );
}
