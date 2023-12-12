import React from 'react'
import './Profile.css';
import NavBar from '../../components/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tweet from '../../components/Tweet';



function Profile() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});
  const [tweets, setTweets] = useState([]);





  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/user/getUserDetails');
        setUserDetails(response.data);

        const tweetResponse = await axios.get(`/api/tweet/getTweetsByUsername/:${userDetails.username}`);
        setTweets(tweetResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };




    fetchUserDetails();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
  
    const formattedTimestamp = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'pm' : 'am'} ${day} ${month} ${year}`;
    return formattedTimestamp;
  };

  return (
    <div className='profile-container'>
      <NavBar />
      <div className='container-split'>

        <div className='left-panel-profile'>

          <div className='white-box'>
            <img className="oval-image"
              src={`data:image/png;base64,${userDetails.profilePic}`}
              alt="Oval" />
            <div classname="profile-text-content">
              <h3>{userDetails.firstName} {userDetails.lastName}</h3>
              <h3>Joined on {new Date(userDetails.createdTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
              <h3>{userDetails.bio}</h3>
              <button className="button-profile" onClick={() => navigate('/setting')}>Edit Profile</button>

            </div>
          </div>


        </div>


        <div className='right-panel-profile'>
          <div className='white-box'>
            <Tweet />
          </div>
          <div>
            <ul>
              {tweets.map((tweet) => (
                <div key={tweet._id} className='white-box'>
                  <p><img className="oval-image-tweet"
                    src={`data:image/png;base64,${userDetails.profilePic}`}
                    alt="Oval" /> <b>{userDetails.firstName}  {userDetails.lastName}</b>
                    </p>
                  <p>{tweet.tweet}</p>
                  {tweet.postimage && (
                    <img className="post-image-tweet" src={`data:image/png;base64,${tweet.postimage}`} alt='Post' />)}
                  <p className='timestamp-tweet'>{formatTimestamp(tweet.timestamp)}</p>                  

                </div>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Profile