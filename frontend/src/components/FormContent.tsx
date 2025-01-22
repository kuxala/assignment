import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type City = {
  id: string;
  name: string;
};

type School = {
  id: string;
  name: string;
};

type Field = {
  prop: string;
  label: string;
  placeholder: string;
  type: string;
  subType?: string;
  validation: {
    type: string;
    minLength?: number;
    required?: boolean;
    min?: number;
    validValues?: boolean[];
  };
  collection?: string;
};

type Step = {
  title: string;
  fields: Field[];
};

interface FormContentProps {
  step: Step | null;
  onNextStep: () => void;
  cities: City[];
  schools: School[];
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  selectedSchool: string;
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
  selectedStep: number;
  formStructure: Step[];
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormContent({
  step,
  onNextStep,
  cities,
  schools,
  selectedCity,
  setSelectedCity,
  selectedSchool,
  setSelectedSchool,
  selectedStep,
  formStructure,
  setIsSubmitted,
}: FormContentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [formData, setFormData] = useState<Record<string, any>>({});
  console.log("Data sent to backend: ", formData);
  useEffect(() => {
    // Check if there's any saved form data in localStorage
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);

      // Pre-fill form fields from saved data
      Object.keys(parsedData).forEach((key) => {
        setValue(key, parsedData[key]);
      });
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const currentData = { ...data };
    setFormData((prev) => ({ ...prev, ...currentData }));

    // Save the current form data to localStorage
    localStorage.setItem(
      "formData",
      JSON.stringify({ ...formData, ...currentData })
    );

    if (selectedStep === formStructure.length - 1) {
      // Submit all data to the backend
      handleFinalSubmit({ ...formData, ...currentData });
    } else {
      // Proceed to the next step
      onNextStep();
    }
  };

  const handleFinalSubmit = async (data: Record<string, any>) => {
    // Convert string fields to numbers before submitting
    const convertedData = Object.keys(data).reduce((acc, key) => {
      const value = data[key];

      // Skip conversion for termsAndConditions field (boolean value)
      if (key === "termsAndConditions") {
        acc[key] = value;
      }
      // Check if the value can be converted to a number and convert it
      else if (!isNaN(value) && value !== "") {
        acc[key] = parseFloat(value); // Use parseInt for integers if needed
      } else {
        acc[key] = value; // Keep the value as is if it cannot be converted
      }

      return acc;
    }, {} as Record<string, any>);

    console.log("Submitting final data to backend:", convertedData);

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Form submitted successfully!");
        console.log("Backend response:", result);
        setIsSubmitted(true);
        localStorage.removeItem("formData");
      } else {
        console.error("Backend validation errors:", result.errors);
        toast.error("Submission failed: " + JSON.stringify(result.errors));
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  useEffect(() => {
    setSelectedSchool("");
  }, [selectedCity, setSelectedSchool]);

  return (
    <div className="form-content p-6 w-full">
      <h2 className="text-2xl font-semibold">{step?.title}</h2>
      {step && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {step.fields.map((field) => (
            <div key={field.prop} className="mb-4">
              {field.type !== "checkbox" && (
                <label className="block">{field.label}</label>
              )}

              {field.type === "input" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{
                    required: field.validation?.required,
                    minLength: field.validation?.minLength,
                    min: field.validation?.min,
                  }}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      type={field.subType || "text"}
                      placeholder={field.placeholder}
                      className="border p-2 w-full"
                    />
                  )}
                />
              )}

              {field.type === "select" && field.prop === "city" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{ required: field.validation?.required }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border p-2 w-full"
                      value={selectedCity}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCity(e.target.value);
                      }}
                    >
                      <option value="">
                        {step.fields.find((f) => f.prop === "city")
                          ?.placeholder || "Select a city"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}

              {field.type === "select" && field.prop === "school" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{ required: field.validation?.required }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border p-2 w-full"
                      value={selectedCity ? selectedSchool : ""}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedSchool(e.target.value);
                      }}
                    >
                      <option value="">
                        {step.fields.find((f) => f.prop === "school")
                          ?.placeholder || "Select a school"}
                      </option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}

              {field.type === "checkbox" &&
                field.prop === "termsAndConditions" && (
                  <Controller
                    name={field.prop}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: controllerField }) => (
                      <div className="flex items-center">
                        <input
                          {...controllerField}
                          type="checkbox"
                          id="terms"
                          className="mr-2"
                        />
                        <label htmlFor="terms">{field.label}</label>
                      </div>
                    )}
                  />
                )}

              {errors[field.prop]?.type === "required" && (
                <p className="text-red-500 text-sm">{`${field.label} is required`}</p>
              )}
              {errors[field.prop]?.type === "minLength" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation.minLength} characters`}</p>
              )}
              {errors[field.prop]?.type === "min" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation.min}`}</p>
              )}
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            {selectedStep === formStructure.length - 1 ? "Submit" : "Next Step"}
          </button>
        </form>
      )}
    </div>
  );
}
