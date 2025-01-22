import { useEffect, useState } from "react";
import FormSidebar from "../components/FormSidebar";
import FormContent from "../components/FormContent";
import { Toaster } from "react-hot-toast";
import { Step } from "../types/types";

export default function FormPage() {
  const [formStructure, setFormStructure] = useState<Step[] | null>(null);
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Fetch form data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/form")
      .then((response) => response.json())
      .then((data) => setFormStructure(data))
      .catch((err) => console.error(err));

    // Fetch cities
    fetch("http://localhost:5000/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Fetch schools based on the selected city
    if (selectedCity) {
      fetch(`http://localhost:5000/api/schools?cityId=${selectedCity}`)
        .then((response) => response.json())
        .then((data) => setSchools(data))
        .catch((err) => console.error(err));
    }
  }, [selectedCity]);

  useEffect(() => {
    fetch("http://localhost:5000/api/submit");
  }, []);
  if (isSubmitted) {
    // Success Page
    return (
      <div className="success-page p-6 w-full text-center">
        <h2 className="text-2xl font-semibold">Thank You!</h2>
        <p className="mt-4">{successMessage}</p>
        <p className="mt-2">We will get back to you shortly.</p>
      </div>
    );
  }
  return (
    <div className="flex bg-[#f0f2f5] max-w-[1920px] mx-auto min-h-screen">
      <Toaster />
      <FormSidebar
        steps={formStructure || []}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
      <FormContent
        step={formStructure ? formStructure[selectedStep] : null}
        cities={cities}
        schools={schools}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        onNextStep={() => setSelectedStep((prev) => prev + 1)}
        selectedStep={selectedStep}
        formStructure={formStructure || []}
        setIsSubmitted={setIsSubmitted}
        setSuccessMessage={setSuccessMessage}
      />
    </div>
  );
}
