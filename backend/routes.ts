import { Router, Request, Response } from 'express';
import cities from './cities.json';
import schools1 from './schools-1.json';
import schools2 from './schools-2.json';
import formStructure from './form.json';

const router = Router();

// Types
interface Validation {
  type: string;
  minLength?: number;
  min?: number;
  required?: boolean;
  validValues?: boolean[];
}

interface Field {
  prop: string;
  label: string;
  validation?: Validation;
}

interface Step {
  fields: Field[];
}

// Route to get cities
router.get('/cities', (req: Request, res: Response) => {
  res.json(cities);
});

// Route to get schools based on city ID
router.get('/schools', (req:any, res: any) => { //____________________change this types later_________
  const cityId = req.query.cityId as string;

  if (!cityId) {
    return res.status(400).json({ error: 'cityId is required' });
  }

  // Select appropriate data based on cityId
  let schools;
  if (cityId === '1') schools = schools1;
  else if (cityId === '2') schools = schools2;
  else schools = [];

  res.json(schools);
});

// Route to get form structure
router.get('/form', (req: Request, res: Response) => {
  res.json(formStructure);
});

// Route to submit form data
router.post('/submit', (req: any, res: any) => { // ________________change this types later______________
  const formData = req.body;

  // Simulate server-side validation
  const errors: Record<string, string> = {};

  // Check each field validation from formStructure
  (formStructure as Step[]).forEach((step) => {
    step.fields.forEach((field) => {
      const { prop, validation } = field;
      const value = formData[prop];

      // Validate required fields
      if (validation?.required && (value === undefined || value === null || value === '')) {
        errors[prop] = `${field.label} is required`;
        return;
      }

      // Additional validation based on type
      if (validation?.type === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          errors[prop] = `${field.label} must be at least ${validation.minLength} characters`;
        }
      } else if (validation?.type === 'number') {
        if (validation.min && value < validation.min) {
          errors[prop] = `${field.label} must be greater than or equal to ${validation.min}`;
        }
      } else if (validation?.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[prop] = `${field.label} must be a valid email`;
        }
      } else if (validation?.type === 'boolean') {
        if (validation.validValues && !validation.validValues.includes(value)) {
          errors[prop] = `${field.label} must be accepted`;
        }
      }
    });
  });

  // Return errors or success response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  res.status(200).json({ message: 'Form submitted successfully' });
});

export default router;
