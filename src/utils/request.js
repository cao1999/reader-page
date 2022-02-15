/**
 * 封装axios方法
 */

import axios from 'axios';
import { baseURL } from '../constant/url';

const http = axios.create({
  baseURL
})

export default http
