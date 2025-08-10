// test-api.js - Simple test script to verify API functionality
import fetch from 'node-fetch';

const API_BASE = 'https://jobroad-backend.vercel.app';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await fetch(`${API_BASE}/`);
    const rootData = await rootResponse.json();
    console.log('Root endpoint response:', rootData);
    console.log('Status:', rootResponse.status, '\n');

    // Test jobs endpoint
    console.log('2. Testing jobs endpoint...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    const jobsData = await jobsResponse.json();
    console.log('Jobs endpoint response:', jobsData);
    console.log('Status:', jobsResponse.status, '\n');

    // Test applications endpoint
    console.log('3. Testing applications endpoint...');
    const appsResponse = await fetch(`${API_BASE}/applications`);
    const appsData = await appsResponse.json();
    console.log('Applications endpoint response:', appsData);
    console.log('Status:', appsResponse.status, '\n');

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();