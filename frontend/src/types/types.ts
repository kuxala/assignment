export interface Field {
  prop: string;

  type: string;

  label: string;

  placeholder?: string;

  subType?: string;

  validation?: {
    required?: boolean;

    minLength?: number;

    min?: number;
  };

  customInput?: {
    placeholder: string;

    validation?: {
      required?: boolean;

      minLength?: number;
    };
  };

  customInputOption?: string;
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
}
