import { axiosInstance } from "./axios"


export const signup = async (signupData) => {
      const res = await axiosInstance.post('/auth/signup', signupData)
      return res.data;
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error; 
  }
};

export const completeOnBoarding = async (userData) => {
      const res = await axiosInstance.post("/auth/onboarding", userData)
      return res.data;
}

export const login = async (loginData) => {
      const res = await axiosInstance.post('/auth/login', loginData)
      return res.data;
}

export const logout = async () => {
      const res = await axiosInstance.post('/auth/logout')
      return res.data;
}

export const getUserFriends = async () => {
      const res = await axiosInstance.get("/users/friends");
      return res.data;
}

export const getRecomendedUsers = async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
}

export const getOutgoingFriendReqs = async () => {
      const res = await axiosInstance.get("/users/outgoing-friend-requests");
      return res.data;
}

export const sendFriendReqs = async (userId) => {
      const res = await axiosInstance.post(`/users/friend-request/${userId}`);
      return res.data;
}

export const getFriendRequest = async ()=>{
      const res = await axiosInstance.get('/users/friend-request');
      return res.data;
}

export const acceptFriendReqs = async (id)=>{
      const res = await axiosInstance.put(`/users/friend-request/${id}/accept`);
      return res.data;
}

export const getStreamToken = async ()=>{
      const res = await axiosInstance.get('/chat/token')
      return res.data;      
}