import * as SecureStore from 'expo-secure-store';

// Save data securely in SecureStore
export const saveData = async (key : string , value : string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Data saved successfully for key: ${key}`);
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Retrieve data securely from SecureStore
export const loadData = async (key : string) => {
  try {
    
    const data = await SecureStore.getItemAsync(key);
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}

// Delete data from SecureStore
export const deleteData = async (key : string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Data deleted successfully for key: ${key}`);
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}
