import { jwtDecode } from "jwt-decode"
import { saveData, loadData, deleteData } from "app/utils/storage/securestore"

const API_URL = "http://10.0.2.2:8000/users" // Backend API URL
const login = async (userData: {}) => {
  try {
    const response = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const jsonData = await response.json()
      return jsonData
      //throw new Error(jsonData.error);
    }
    const jsonData = await response.json()
    saveData("accessToken", jsonData.access)
    saveData("refreshToken", jsonData.refresh)
    return jsonData
  } catch (error: any) {
    console.log("Error fetching data:", error.message)
  }
}

const register = async (userData: {}) => {
  try {
    const response = await fetch(`${API_URL}/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const jsonData = await response.json()
      return jsonData
      //throw new Error(jsonData.error);
    }
    const jsonData = await response.json()
    saveData("accessToken", jsonData.access)
    saveData("refreshToken", jsonData.refresh)
    return jsonData
  } catch (error: any) {
    console.log("Error fetching data:", error.message)
  }
}

const logout = () => {
  deleteData("accessToken")
  deleteData("refreshToken")
}
//need to finish function
const refreshToken = async () => {
  const refreshToken = loadData("refreshToken")
  if (refreshToken) {
    try {
      //fectch from backend refrsh token
      if (data.access && data.refreshToken) {
        saveData("accessToken", data.access)
        saveData("refreshToken", data.refresh)
      }
      return data
    } catch (error) {
      throw new Error("Token refresh failed. Please log in again.")
    }
  }
}

const checkTokenExpiry = async () => {
  const token = await loadData("accessToken")
  if (token) {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      await refreshToken()
    }
  }
}

export default {
  login,
  register,
  logout,
  refreshToken,
  checkTokenExpiry,
}
