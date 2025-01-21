import React, { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

// Types for City and School
type City = {
  id: string;
  name: string;
};

type School = {
  id: string;
  name: string;
};

// Field structure type
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
  collection?: string; // For select options
  customInput?: {
    label: string;
    placeholder: string;
    validation: {
      type: string;
      minLength?: number;
      required: boolean;
    };
  };
};

// Step type
type Step = {
  title: string;
  fields: Field[];
};

interface FormContentProps {
  step: Step | null;
  onNextStep: () => void;
  cities: City[]; // Updated to reflect correct type
  schools: School[]; // Updated to reflect correct type
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  selectedSchool: string;
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
  selectedStep: number;
  formStructure: Step[];
}

export default function FormContent({
  step,
  onNextStep,
  cities,
  schools,
  selectedSchool,
  selectedCity,
  setSelectedCity,
  setSelectedSchool,
  selectedStep,
  formStructure,
}: FormContentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("Form submitted with data: ", data); // Log submitted data

    // Check selected city and school
    console.log("Selected City before submit: ", selectedCity);
    console.log(
      "Selected School before submit: ",
      selectedCity ? selectedSchool : "N/A"
    );

    if (selectedStep === formStructure.length - 1) {
      // Handle form submission
      console.log("Form submitted", data);
    } else {
      onNextStep(); // Move to the next step after successful form submission
    }
  };

  useEffect(() => {
    // Reset the selected school whenever the city changes
    setSelectedSchool("");
    console.log("City changed, resetting school. Selected city:", selectedCity);
  }, [selectedCity, setSelectedSchool]);

  return (
    <div className="form-content p-6 w-full">
      <h2 className="text-2xl font-semibold">{step?.title}</h2>
      {step && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {step.fields.map((field) => (
            <div key={field.prop} className="mb-4">
              {/* Render label for non-checkbox fields */}
              {field.type !== "checkbox" && (
                <label className="block">{field.label}</label>
              )}

              {/* Handle input fields */}
              {field.type === "input" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{ required: field.validation?.required }}
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

              {/* Handle city select */}
              {field.type === "select" && field.prop === "city" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{ required: field.validation?.required }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border p-2 w-full"
                      value={selectedCity} // Sync the selected city
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCity(e.target.value); // Update the selected city
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

              {/* Handle school select */}
              {field.type === "select" && field.prop === "school" && (
                <Controller
                  name={field.prop}
                  control={control}
                  rules={{ required: field.validation?.required }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border p-2 w-full"
                      value={selectedCity ? selectedSchool : ""} // Sync with school selection
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedSchool(e.target.value); // Update the selected school
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

              {/* Handle Terms and Conditions checkbox */}
              {field.type === "checkbox" &&
                field.prop === "termsAndConditions" && (
                  <Controller
                    name={field.prop}
                    control={control}
                    rules={{ required: true }} // Making it required
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

              {/* Display error if field validation fails */}
              {errors[field.prop] && (
                <p className="text-red-500 text-sm">{`${field.label} is required`}</p>
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
