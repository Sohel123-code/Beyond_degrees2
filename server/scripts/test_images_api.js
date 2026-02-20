import axios from 'axios';

const testApi = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/concepts');
        console.log('Categories count:', response.data.length);
        response.data.forEach(cat => {
            console.log(`ID: ${cat.id}, Image: ${cat.image}`);
        });
    } catch (error) {
        console.error('API Error:', error.message);
    }
};

testApi();
