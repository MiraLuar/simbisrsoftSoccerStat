import axios from "axios";

export default (id) => axios.get(`${process.env.REACT_APP_BASE_URL}/v2/teams/`, {headers: {'X-Auth-Token': process.env.REACT_APP_AUTH_TOKEN},})