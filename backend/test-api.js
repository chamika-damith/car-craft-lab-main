import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'TestPass123',
  firstName: 'Test',
  lastName: 'User'
};

let authToken = null;

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`\n${options.method || 'GET'} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { response: null, data: null };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  await makeRequest('/health');
}

async function testUserRegistration() {
  console.log('\n🔍 Testing User Registration...');
  const { data } = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (data.success) {
    authToken = data.data.token;
    console.log('✅ Registration successful, token saved');
  }
}

async function testUserLogin() {
  console.log('\n🔍 Testing User Login...');
  const { data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  if (data.success) {
    authToken = data.data.token;
    console.log('✅ Login successful, token updated');
  }
}

async function testGetProfile() {
  console.log('\n🔍 Testing Get Profile...');
  await makeRequest('/auth/profile');
}

async function testGetServices() {
  console.log('\n🔍 Testing Get Services...');
  await makeRequest('/services');
}

async function testGetServicesWithFilters() {
  console.log('\n🔍 Testing Get Services with Filters...');
  await makeRequest('/services?category=exterior&limit=3');
}

async function testGetServiceById() {
  console.log('\n🔍 Testing Get Service by ID...');
  // First get services to get an ID
  const { data } = await makeRequest('/services?limit=1');
  if (data.success && data.data.services.length > 0) {
    const serviceId = data.data.services[0]._id;
    await makeRequest(`/services/${serviceId}`);
  }
}

async function testCreateBuild() {
  console.log('\n🔍 Testing Create Build...');
  
  // First get some services to use in the build
  const { data: servicesData } = await makeRequest('/services?limit=2');
  
  if (servicesData.success && servicesData.data.services.length >= 2) {
    const selectedServices = servicesData.data.services.map(service => ({
      service: service._id,
      quantity: 1
    }));

    const buildData = {
      name: 'Test Build',
      description: 'A test car customization build',
      carModel: 'Civic',
      carYear: 2020,
      carMake: 'Honda',
      selectedServices,
      isPublic: false,
      tags: ['test', 'demo']
    };

    await makeRequest('/builds', {
      method: 'POST',
      body: JSON.stringify(buildData)
    });
  }
}

async function testGetUserBuilds() {
  console.log('\n🔍 Testing Get User Builds...');
  // This would need a user ID, but for now we'll test the endpoint structure
  console.log('Note: This endpoint requires a valid user ID');
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  try {
    await testHealthCheck();
    await testUserRegistration();
    await testUserLogin();
    await testGetProfile();
    await testGetServices();
    await testGetServicesWithFilters();
    await testGetServiceById();
    await testCreateBuild();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 