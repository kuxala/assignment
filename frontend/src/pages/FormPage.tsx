import { useEffect, useState } from "react";
import FormSidebar from "../components/FormSidebar";
import FormContent from "../components/FormContent";
import { Toaster } from "react-hot-toast";
import { Step } from "../types/types";
import { fetchFormStructure, fetchCities, fetchSchools } from "../utils/api";

export default function FormPage() {
  const [formStructure, setFormStructure] = useState<Step[] | null>(null);
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch form structure and cities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await fetchFormStructure();
        const cityData = await fetchCities();
        setFormStructure(formData);
        setCities(cityData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Fetch schools whenever selected city changes
  useEffect(() => {
    if (selectedCity) {
      const fetchSchoolData = async () => {
        try {
          const schoolData = await fetchSchools(selectedCity);
          setSchools(schoolData);
        } catch (error) {
          console.error("Error fetching schools", error);
        }
      };

      fetchSchoolData();
    }
  }, [selectedCity]);

  if (isSubmitted) {
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
