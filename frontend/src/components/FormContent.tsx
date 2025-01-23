// External imports
import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

// Internal imports
import { FormContentProps } from "../types/types";
import { submitFormData } from "../utils/api";

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

  // Handle localStorage data
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      Object.keys(parsedData).forEach((key) => setValue(key, parsedData[key]));
    }
  }, [setValue]);

  // Handle city selection reset
  useEffect(() => {
    setSelectedSchool("");
  }, [selectedCity, setSelectedSchool]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const currentData = { ...data };
    const updatedFormData = { ...formData, ...currentData };

    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));

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
      localStorage.removeItem("formData");
    } catch (error: any) {
      console.error("Error during form submission:", error);
      toast.error("Submission failed: " + error.message);
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
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                />
                <label htmlFor="terms">{field.label}</label>
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
              {errors[field.prop]?.type === "required" && (
                <p className="text-red-500 text-sm">{`${field.label} is required`}</p>
              )}
              {errors[field.prop]?.type === "minLength" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation?.minLength} characters`}</p>
              )}
              {errors[field.prop]?.type === "min" && (
                <p className="text-red-500 text-sm">{`${field.label} must be at least ${field.validation?.min}`}</p>
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
