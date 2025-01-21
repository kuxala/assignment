// types.ts
export interface City {
    id: string;
    name: string;
  }
  
  export interface School {
    id: string;
    name: string;
    cityId: string;
  }
  
  export interface Field {
    prop: string;
    label: string;
    validation?: {
      type: string;
      minLength?: number;
      min?: number;
      required?: boolean;
      validValues?: boolean[];
    };
  }
  
  export interface Step {
    fields: Field[];
  }
  
  export interface FormStructure {
    steps: Step[];
  }
  