import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FormContentProps } from "../types/types";

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
  setSuccessMessage,
}: FormContentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [formData, setFormData] = useState<Record<string, any>>({});
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
        setIsSubmitted(true);
        setSuccessMessage(result.message);
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
                  render={({ field: selectField }) => (
                    <>
                      {/* Dropdown for Schools */}
                      <select
                        {...selectField}
                        className="border p-2 w-full"
                        value={selectedSchool}
                        onChange={(e) => {
                          const value = e.target.value;
                          selectField.onChange(value);
                          setSelectedSchool(value);
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
                        <option value="custom">
                          {field.customInputOption}
                        </option>
                      </select>

                      {/* Custom Input for School Name */}
                      {selectedSchool === "custom" && field.customInput && (
                        <Controller
                          name="school"
                          control={control}
                          rules={{
                            required: field.customInput.validation?.required,
                            minLength: field.customInput.validation?.minLength,
                          }}
                          render={({ field: customInputField }) => (
                            <input
                              {...customInputField}
                              type="text"
                              placeholder={field.customInput?.placeholder}
                              className="border p-2 w-full mt-2"
                            />
                          )}
                        />
                      )}
                    </>
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
              {errors[field.prop]?.type === "minLength" &&
                field.validation?.minLength && (
                  <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation.minLength} characters`}</p>
                )}
              {errors[field.prop]?.type === "min" && field.validation?.min && (
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
