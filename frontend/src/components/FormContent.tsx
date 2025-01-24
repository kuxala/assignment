// External imports
import { useEffect, useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

// Internal imports
import { FormContentProps } from "../types/types";
import { fetchFormStructure, submitFormData } from "../utils/api";

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
  setSelectedStep,
  setFormStructure,
}: FormContentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();

  const [formData, setFormData] = useState<Record<string, any>>({});

  // Create the inputRefs ref using useRef
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  >({});

  // Handle city selection reset
  useEffect(() => {
    setSelectedSchool("");
  }, [selectedCity, setSelectedSchool]);

  useEffect(() => {
    if (step?.fields) {
      step.fields.forEach((field) => {
        if (field.type === "checkbox" && field.defaultValue !== undefined) {
          setValue(field.prop, field.defaultValue);
        }
      });
    }
  }, [setValue, step]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const currentData = { ...data };
    const updatedFormData = { ...formData, ...currentData };

    setFormData(updatedFormData);

    if (selectedStep === formStructure.length - 1) {
      handleFinalSubmit(updatedFormData);
    } else {
      onNextStep();
    }
  };

  const handleFinalSubmit = async (data: Record<string, any>) => {
    try {
      const result = await submitFormData(data);
      toast.success("Form submitted successfully!");
      setIsSubmitted(true);
      setSuccessMessage(result.message);
    } catch (error: any) {
      console.error("Error during form submission:", error);

      // If the error contains a server-side message, handle it
      if (typeof error.message === "string") {
        try {
          const serverErrors = JSON.parse(error.message);

          Object.keys(serverErrors).forEach((key) => {
            setError(key, {
              type: "manual",
              message: serverErrors[key],
            });
          });

          // Identify the step with the first error
          const firstErrorKey = Object.keys(serverErrors)[0];
          const stepWithError = formStructure.findIndex((step) =>
            step.fields.some((field) => field.prop === firstErrorKey)
          );

          // Navigate to the step with the error
          if (stepWithError !== -1) {
            setSelectedStep(stepWithError);
          }

          // Focus on the first field with an error
          if (firstErrorKey && inputRefs.current[firstErrorKey]) {
            inputRefs.current[firstErrorKey].focus();
          }

          // Refetch the form structure if the backend has changed
          console.log("Refetching form structure due to backend updates...");
          const updatedFormStructure = await fetchFormStructure();
          setFormStructure(updatedFormStructure);
          toast("Form structure has been updated. Please review the changes.");
        } catch (parseError) {
          console.error("Error parsing server error message:", parseError);
          toast.error(
            "Unexpected error occurred while processing server errors."
          );
        }
      } else {
        toast.error("Submission failed: " + error.message);
      }
    }
  };

  // Function to register input refs
  const registerRef =
    (field: any) =>
    (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
      if (el) {
        inputRefs.current[field.prop] = el;
      }
    };

  const renderField = (field: any) => {
    const validationRules = {
      required: field.validation?.required,
      minLength: field.validation?.minLength,
      min: field.validation?.min,
    };

    switch (field.type) {
      case "input":
        return (
          <Controller
            name={field.prop}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <input
                {...controllerField}
                ref={registerRef(field)} // Pass field to registerRef
                type={field.subType || "text"}
                placeholder={field.placeholder}
                className="border p-2 w-full"
              />
            )}
          />
        );

      case "select":
        return renderSelectField(field);

      case "checkbox":
        return (
          <Controller
            name={field.prop}
            control={control}
            rules={{ required: true }}
            render={({ field: controllerField }) => (
              <div className="flex items-center">
                <input
                  {...controllerField}
                  ref={registerRef(field)} // Pass field to registerRef
                  type="checkbox"
                  id={field.prop}
                  className="mr-2"
                  checked={controllerField.value}
                />
                <label htmlFor={field.prop}>{field.label}</label>
              </div>
            )}
          />
        );

      default:
        return null;
    }
  };

  const renderSelectField = (field: any) => {
    const isCity = field.prop === "city";
    const isSchool = field.prop === "school";

    return (
      <Controller
        name={field.prop}
        control={control}
        rules={{ required: field.validation?.required }}
        render={({ field: controllerField }) => (
          <>
            <select
              {...controllerField}
              ref={registerRef(field)} // Pass field to registerRef
              className="border p-2 w-full"
              value={isCity ? selectedCity : selectedSchool}
              onChange={(e) => {
                const value = e.target.value;
                controllerField.onChange(value);
                isCity && setSelectedCity(value);
                isSchool && setSelectedSchool(value);
              }}
            >
              <option value="">
                {field.placeholder || "Select an option"}
              </option>
              {(isCity ? cities : schools).map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
              {isSchool && field.customInputOption && (
                <option value="custom">{field.customInputOption}</option>
              )}
            </select>

            {isSchool && selectedSchool === "custom" && field.customInput && (
              <Controller
                name="school"
                control={control}
                rules={{
                  required: field.customInput.validation?.required,
                  minLength: field.customInput.validation?.minLength,
                }}
                render={({ field: customField }) => (
                  <input
                    {...customField}
                    ref={registerRef(field)} // Pass field to registerRef
                    type="text"
                    placeholder={field.customInput.placeholder || ""}
                    className="border p-2 w-full mt-2"
                  />
                )}
              />
            )}
          </>
        )}
      />
    );
  };

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
              {renderField(field)}
              {/* Display errors */}
              {errors[field.prop]?.type === "required" && (
                <p className="text-red-500 text-sm">{`${field.label} is required`}</p>
              )}
              {errors[field.prop]?.type === "minLength" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation?.minLength} characters`}</p>
              )}
              {errors[field.prop]?.type === "min" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation?.min}`}</p>
              )}
              {errors[field.prop]?.type === "manual" && (
                <p className="text-red-500 text-sm">{`${
                  errors[field.prop]?.message
                }`}</p>
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
