// utils/api.ts
export const fetchFormStructure = async () => {
    const response = await fetch("http://localhost:5000/api/form");
    if (!response.ok) {
      throw new Error("Failed to fetch form structure");
    }
    return response.json();
  };
  
  export const fetchCities = async () => {
    const response = await fetch("http://localhost:5000/api/cities");
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    return response.json();
  };
  
  export const fetchSchools = async (cityId: string) => {
    const response = await fetch(`http://localhost:5000/api/schools?cityId=${cityId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch schools");
    }
    return response.json();
  };
  