import axios from 'axios';

const testApi = async () => {
    try {
        console.log('Testing /api/concepts/career-skills...');
        const response = await axios.get('http://localhost:5000/api/concepts/career-skills');
        console.log('Status:', response.status);
        console.log('Sources count:', response.data.sources.length);
        if (response.data.sources.length > 0) {
            console.log('First source:', response.data.sources[0]);
        }
    } catch (error) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
};

testApi();
