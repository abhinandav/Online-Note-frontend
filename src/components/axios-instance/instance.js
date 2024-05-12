import axios from "axios"; 
import { useState } from "react";


const API_BASE_URL= 'http://16.171.136.105'

export const UserAxios = axios.create({
    baseURL: `${API_BASE_URL}`,
  });

export const AuthUserAxios = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});



