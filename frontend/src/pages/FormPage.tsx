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
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch form structure and cities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formData = await fetchFormStructure();
        console.log(formData);
        const cityData = await fetchCities();
        setFormStructure(formData);
        setCities(cityData);
        setFetchError(null);
      } catch (error: any) {
        console.error("Error fetching data", error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
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

  const fetchForm = async () => {
    try {
      setLoading(true);
      const updatedFormStructure = await fetchFormStructure();
      setFormStructure(updatedFormStructure);
      setFetchError(null);
    } catch (error: any) {
      setFetchError(error.message);
      console.error("Error refetching form", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (formStructure && selectedStep < formStructure.length - 1) {
      setSelectedStep(selectedStep + 1);
    }
  };

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

      {loading && <div className="text-center w-full p-6">Loading...</div>}
      {fetchError && (
        <div className="text-red-500 text-center mt-4 w-full p-6">
          <p>Error: {fetchError}</p>
          <button
            onClick={fetchForm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !fetchError && formStructure && (
        <div className="w-full">
          <FormContent
            step={formStructure ? formStructure[selectedStep] : null}
            cities={cities}
            schools={schools}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            onNextStep={handleNextStep}
            setSelectedStep={setSelectedStep}
            selectedStep={selectedStep}
            formStructure={formStructure}
            setIsSubmitted={setIsSubmitted}
            setSuccessMessage={setSuccessMessage}
            loading={loading}
            setLoading={setLoading}
            setFormStructure={setFormStructure}
          />
        </div>
      )}
    </div>
  );
}
