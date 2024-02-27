import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import axios from 'axios';

const Bookingscreen = () => {
    const { scanid, date,} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [scan, setScan] = useState();
    const [totalamount, setTotalamount] = useState();
    const [imageUrl, setImageUrl] = useState('');
    const [age, setAge] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.post('http://localhost:3500/scans/getallscanbyid', { scanids: [scanid] });
          setTotalamount(response.data[0].samount);
          setScan(response.data[0]);
          setLoading(false);
  
          // Convert base64 encoded image data to data URL
          if (response.data[0].scanImageURL) {
            const imageData = response.data[0].scanImageURL;
            const imageUrl = `data:${imageData.contentType};base64,${imageData.data}`;
            setImageUrl(imageUrl);
          }
        } catch (error) {
          setError(true);
          console.error(error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [scanid]);
  
    async function onToken(token) {
      const bookDetails = {
        scan,
        userid: JSON.parse(localStorage.getItem('currentuser'))._id,
        age: age,
        date,
        totalamount,
        token,
      };
  
      try {
        setLoading(true);
        const result = await axios.post('http://localhost:3500/bookings/bookscan', bookDetails);
        setLoading(false);
        Alert("Congratulations", "Your Room has Been Booked Successfully", "success");
      } catch (error) {
        setLoading(false);
        Alert('Oops', "Something went wrong", "error");
      }
    }
  
    return (
      <Box m={5}>
        {loading ? (
          <Typography variant="h4" align="center">
            <CircularProgress />
          </Typography>
        ) : error ? (
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5">Error Fetching Room Data</Typography>
          </Paper>
        ) : (
          <Box>
            <Box display="flex" justifyContent="center" mt={5}>
              <Box>
                <Typography variant="h4">{scan.sname}</Typography>
                {imageUrl && <img src={imageUrl} className='bigimg' alt="Scan Preview" />}
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={5}>
              <Paper elevation={3} style={{ padding: 20 }}>
                <Box textAlign="right">
                  <Typography variant="h4">Booking Details</Typography>
                  <hr />
                  <Typography>Name: {JSON.parse(localStorage.getItem('currentuser')).name}</Typography>
                  <Typography>Age: {age}</Typography>
                  <Typography>Date: {date}</Typography>
                  <Typography>Amount:</Typography>
                  <hr />
                  <Typography>Total Amount: {totalamount}</Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

export default Bookingscreen