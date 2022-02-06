import axios from "axios";

export default (id) => axios.get(`http://api.football-data.org/v2/competitions/${id}/teams`, {headers: {'X-Auth-Token': process.env.REACT_APP_AUTH_TOKEN},})