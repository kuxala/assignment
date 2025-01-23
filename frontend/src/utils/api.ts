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
  
  export const submitFormData = async (data: Record<string, any>) => {
    const convertedData = Object.keys(data).reduce((acc, key) => {
      const value = data[key];
  
      // Skip conversion for boolean values like "termsAndConditions"
      if (key === "termsAndConditions") {
        acc[key] = value;
      }
      // Convert strings to numbers if applicable
      else if (!isNaN(value) && value !== "") {
        acc[key] = parseFloat(value);
      } else {
        acc[key] = value; // Keep other fields as is
      }
  
      return acc;
    }, {} as Record<string, any>);
  
    const response = await fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(convertedData),
    });
  
    if (!response.ok) {
      const result = await response.json();
      throw new Error(JSON.stringify(result.errors));
    }
  
    return response.json();
  };
  