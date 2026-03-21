import http from 'k6/http';
import { check, sleep } from 'k6';

// This K6 script tests the /th/courses endpoint
// It simulates 10 concurrent Virtual Users (VUs) checking the course listings
export const options = {
    stages: [
        { duration: '30s', target: 10 }, // Ramp-up to 10 users over 30 seconds
        { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
        { duration: '10s', target: 0 },  // Ramp-down to 0 users
    ],
    thresholds: {
        // Important: Vercel Free Plan has a 10s Serverless Function timeout
        // 95% of requests must complete below 2s
        http_req_duration: ['p(95)<2000'],
        // Failure rate should be effectively 0 (< 1%)
        http_req_failed: ['rate<0.01'], 
    },
};

export default function () {
    const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';
    
    // Simulate user hitting the courses page which loads from MongoDB
    const res = http.get(`${BASE_URL}/th/courses`);
    
    // Check if the response was successful
    check(res, {
        'is status 200': (r) => r.status === 200,
        // Optional verification if the page contains some basic text
        'verify page loaded': (r) => r.body.includes('วิชาทั้งหมด') || r.body.includes('ทั้งหมด'),
    });
    
    // Think time - don't hit the DB blindly fast, simulate human browsing delay
    sleep(1);
}
