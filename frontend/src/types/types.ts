export interface Field {
  prop: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  validation?: {
    required: boolean;
    type?: string;
    minLength?: number;
    min?: number;
  };
}

export type Step = {
  title: string;
  fields: Field[];
};

export type City = {
  id: string;
  name: string;
};

export type School = {
  id: string;
  name: string;
};

export interface FormContentProps {
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
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
