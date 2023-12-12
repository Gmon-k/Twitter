// tweet.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './StylesFolder/Tweet.css';

function Tweet() {
  const [tweet, setTweet] = useState('');
  const [postimage, setPostimage] = useState(null);


  async function updateTweet() {
    try {
      const formData = new FormData();
      formData.append('tweet', tweet);
      formData.append('postimage', postimage);

      await axios.post('/api/tweet/insertTweet', formData);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  }


  return (
    <div className="tweet-form-container">
        <label>
          <input type="text" className='tweet-input' value={tweet} onChange={(e) => setTweet(e.target.value)} />
        </label>
        <label>
          <br />
          <p></p>
          Choose Image:
          <input type="file" accept="image/*" onChange={(e) => setPostimage(e.target.files[0])} />
        </label>
        <p></p>
        <button type="submit" onClick={updateTweet} className='tweet-button'>Tweet</button>
    </div>
  );
}

export default Tweet;
