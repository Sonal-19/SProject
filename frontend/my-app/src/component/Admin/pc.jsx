import { useState, useEffect } from 'react';
import { faUser, faBox, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CountUp from 'react-countup';
import { PieChart } from 'react-minimal-pie-chart';
import axios from 'axios';

function Card() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const[totalWishlists, setTotalWishlists] = useState(0);
  const[totalCarts, setTotalCarts] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const userToken = localStorage.getItem('token');
        const responseUsers = await axios.get('http://localhost:3059/users/api/allUsers', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const users = responseUsers.data.users;
        setTotalUsers(users.length);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    const fetchTotalProducts = async () => {
      try {
        const productToken = localStorage.getItem('token');
        const responseProducts = await axios.get('http://localhost:3059/users/api/viewProducts', {
          headers: { Authorization: `Bearer ${productToken}` },
        });
        const products = responseProducts.data;
        setTotalProducts(products.length);
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    const fetchTotalWishlists = async () => {
      try {
        const wishlistToken = localStorage.getItem('token');
        const responseWishlists = await axios.get('http://localhost:3059/users/api/getAllWishlist', {
          headers: { Authorization: `Bearer ${wishlistToken}` },
        });
        const wishlists = responseWishlists.data;
        setTotalWishlists(wishlists.length);
      } catch (error) {
        console.error('Error fetching total wishlist:', error);
      }
    };

    const fetchTotalCarts = async () => {
      try {
        const cartToken = localStorage.getItem('token');
        const responseCarts = await axios.get('http://localhost:3059/users/api/getAllCart', {
          headers: { Authorization: `Bearer ${cartToken}` },
        });
        const carts = responseCarts.data;
        setTotalCarts(carts.length);
      } catch (error) {
        console.error('Error fetching total cart:', error);
      }
    };

    fetchTotalUsers();
    fetchTotalProducts();
    fetchTotalWishlists();
    fetchTotalCarts();
  }, []);

  const chartData = [
    { title: 'Users', value: totalUsers, color: 'rgba(5, 132, 237, 0.895)' },
    { title: 'Products', value: totalProducts, color: 'rgb(255, 221, 3)' },
    { title: 'Wishlists', value: totalWishlists, color: 'rgba(255, 4, 88, 0.895)' },
    { title: 'Carts', value: totalCarts, color: 'rgb(255, 121, 3)' },
  ];

  return (
    <div className='container pt-5 mt-2'>
      <div className="cardA rounded bg-white border d-flex shadow p-4" style={{ maxWidth: '500px', width: '90vw' }}>
        <div>
        <div className='ms-5' style={{ width: '380px', height: '200px' }}>
          <PieChart
            data={chartData}
            label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
          />
        </div>
        <div className='mb-2 d-flex'> 
          <FontAwesomeIcon icon={faUser} style={{ color: 'rgba(5, 132, 237, 0.895)', fontSize: '2.2em' }} />
          <CountUp end={totalUsers} duration={5} />
        </div>
        <div> 
          <FontAwesomeIcon icon={faBox} style={{ color: 'rgb(255, 221, 3)', fontSize: '2.2em' }} />
          <CountUp end={totalProducts} duration={5} />
        </div>
        <div> 
          <FontAwesomeIcon icon={faHeart} style={{ color: 'rgba(255, 4, 88, 0.895)', fontSize: '2.2em' }} />
          <CountUp end={totalWishlists} duration={5} />
        </div>
        </div>
      </div>
    </div>
  );
}

export default Card;


/*
import { useState, useEffect } from 'react';
//import CountUp from 'react-countup';
import { PieChart } from 'react-minimal-pie-chart';
import axios from 'axios';

function Card() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const[totalWishlists, setTotalWishlists] = useState(0);
  const[totalCarts, setTotalCarts] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const userToken = localStorage.getItem('token');
        const responseUsers = await axios.get('http://localhost:3059/users/api/allUsers', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const users = responseUsers.data.users;
        setTotalUsers(users.length);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    const fetchTotalProducts = async () => {
      try {
        const productToken = localStorage.getItem('token');
        const responseProducts = await axios.get('http://localhost:3059/users/api/viewProducts', {
          headers: { Authorization: `Bearer ${productToken}` },
        });
        const products = responseProducts.data;
        setTotalProducts(products.length);
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    const fetchTotalWishlists = async () => {
      try {
        const wishlistToken = localStorage.getItem('token');
        const responseWishlists = await axios.get('http://localhost:3059/users/api/getAllWishlist', {
          headers: { Authorization: `Bearer ${wishlistToken}` },
        });
        const wishlists = responseWishlists.data;
        setTotalWishlists(wishlists.length);
      } catch (error) {
        console.error('Error fetching total wishlist:', error);
      }
    };

    const fetchTotalCarts = async () => {
      try {
        const cartToken = localStorage.getItem('token');
        const responseCarts = await axios.get('http://localhost:3059/users/api/getAllCart', {
          headers: { Authorization: `Bearer ${cartToken}` },
        });
        const carts = responseCarts.data;
        setTotalCarts(carts.length);
      } catch (error) {
        console.error('Error fetching total cart:', error);
      }
    };

    fetchTotalUsers();
    fetchTotalProducts();
    fetchTotalWishlists();
    fetchTotalCarts();
  }, []);

  const chartData = [
    { title: ' ', value: totalUsers, color: 'rgba(5, 132, 237, 0.895)', borderColor: 'rgba(5, 132, 237, 0.5)' },
    { title: ' ', value: totalProducts, color: 'rgb(255, 221, 3)' },
    { title: ' ', value: totalWishlists, color: 'rgba(255, 4, 88, 0.895)' },
    { title: ' ', value: totalCarts, color: 'rgb(255, 121, 3)' },
  ];

  return (
    <div className='container pt-5 mt-2'>
      <div className="cardA rounded bg-white border d-flex shadow p-4" style={{ maxWidth: '500px', width: '90vw' }}>
        <div>
        <div className='ms-5' style={{ width: '380px', height: '200px' }}>
          <PieChart
            animation
            animationDuration={500}
            animationEasing="ease-out"
            center={[50, 50]}
            data={chartData}
            //label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelPosition={50}
            lengthAngle={360}
            lineWidth={15}
            paddingAngle={0}
            radius={50}
            rounded
            startAngle={0}
            viewBoxSize={[100, 100]}
            labelStyle={{
                fontSize: "10px",
                fontColor: 'white',
                fontWeight: "800",
              }}
      
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

*/