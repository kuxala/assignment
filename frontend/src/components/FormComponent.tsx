// FormPage.tsx
import React, { useEffect, useState } from "react";
import { City, School, FormStructure } from "../types/types";

const FormPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [formStructure, setFormStructure] = useState<FormStructure | null>(
    null
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    // Fetch cities
    fetch("/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));

    // Fetch form structure
    fetch("/api/form")
      .then((response) => response.json())
      .then((data) => setFormStructure(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Fetch schools based on selected city
    if (selectedCity) {
      fetch(`/api/schools?cityId=${selectedCity}`)
        .then((response) => response.json())
        .then((data) => setSchools(data))
        .catch((err) => console.error(err));
    }
  }, [selectedCity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Submit form data
    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Form Page</h1>

      {/* City Selection */}
      <select value={selectedCity} onChange={handleCityChange}>
        <option value="">Select a City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      {/* School Selection */}
      {selectedCity && (
        <select>
          <option value="">Select a School</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      )}

      {/* Form */}
      {formStructure && (
        <form onSubmit={handleSubmit}>
          {formStructure.steps.map((step, stepIndex) => (
            <div key={stepIndex}>
              {step.fields.map((field) => (
                <div key={field.prop}>
                  <label>{field.label}</label>
                  <input
                    type={field.validation?.type || "text"}
                    name={field.prop}
                    value={formData[field.prop] || ""}
                    onChange={handleChange}
                  />
                  {errors[field.prop] && (
                    <p style={{ color: "red" }}>{errors[field.prop]}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default FormPage;
