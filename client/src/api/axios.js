import axios from 'axios'

console.log("localStorage.getItem('access_token'): ", localStorage.getItem('access_token'));
console.log("localStorage.getItem('userId'): ", localStorage.getItem('userId'));
let ax = axios.create({
    baseURL : 'http://localhost:3000',
    headers : {
        access_token : localStorage.getItem('access_token'),
        userId : localStorage.getItem('userId')
    }
})

module.exports = ax