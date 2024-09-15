import { saveData, deleteData } from "app/utils/storage/securestore"

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
    const jsonData = await response.json()
    if (!response.ok) {
      throw new Error(jsonData.error)
    }
    saveData("accessToken", jsonData.access).catch((error) => {
      throw new Error(error)
    })
    saveData("refreshToken", jsonData.refresh).catch((error) => {
      throw new Error(error)
    })
    return Promise.resolve()
  } catch (error: any) {
    console.log("Error fetching data:", error.message)
    return Promise.reject(error.message)
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
    const jsonData = await response.json()
    if (!response.ok) {
      throw new Error(jsonData.error)
    }
    saveData("accessToken", jsonData.access).catch((error) => {
      throw new Error(error)
    })
    saveData("refreshToken", jsonData.refresh).catch((error) => {
      throw new Error(error)
    })
    return Promise.resolve()
  } catch (error: any) {
    console.log("Error fetching data:", error.message)
    return Promise.reject(error)
  }
}

const logout = async () => {
  try {
    await deleteData("accessToken").catch((error) => {
      throw new Error(error)
    })
    await deleteData("refreshToken").catch((error) => {
      throw new Error(error)
    })
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
// need to finish function
// const refreshToken = async () => {

//   const refreshToken = loadData("refreshToken")
//   if (refreshToken) {
//     try {
//       fectch from backend refrsh token
//       if (data.access && data.refreshToken) {
//         saveData("accessToken", data.access)
//         saveData("refreshToken", data.refresh)
//       }
//       return data
//     } catch (error) {
//       throw new Error("Token refresh failed. Please log in again.")
//     }
//   }
// }

// const checkTokenExpiry = async () => {
//   const token = await loadData("accessToken")
//   if (token) {
//     const decoded = jwtDecode(token)
//     const currentTime = Date.now() / 1000
//     if (decoded.exp < currentTime) {
//       await refreshToken()
//     }
//   }
// }

export default {
  login,
  register,
  logout,
}
