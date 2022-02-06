import axios from "axios";

export default () => axios.get('http://api.football-data.org/v2/competitions/', {headers: {'X-Auth-Token': process.env.REACT_APP_AUTH_TOKEN},})