import formStructure from '../data/form.json';

const validateField = (field: any, value: any, errors: Record<string, string>) => {
  const { prop, label, validation } = field;

  // Skip validation for 'school' field
  if (prop === 'school') {
    if (typeof value !== 'string' && typeof value !== 'number') {
      errors[prop] = `${label} must be either a string or a number.`;
    }
    return;
  }

  // Required field validation
  if (validation?.required && (value === undefined || value === null || value === '')) {
    errors[prop] = `${label} is required.`;
    return;
  }

  // Type-specific validation
  if (value !== undefined) {
    if (validation?.type === 'string' && typeof value !== 'string') {
      errors[prop] = `${label} must be a string.`;
    } else if (validation?.type === 'number' && typeof value !== 'number') {
      errors[prop] = `${label} must be a number.`;
    } else if (validation?.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[prop] = `${label} is not a valid email address.`;
      }
    }

    // MinLength validation
    if (validation?.minLength && typeof value === 'string' && value.length < validation.minLength) {
      errors[prop] = `${label} must be at least ${validation.minLength} characters long.`;
    }

    // Min validation for numbers
    if (validation?.min && typeof value === 'number' && value < validation.min) {
      errors[prop] = `${label} must be at least ${validation.min}.`;
    }
  }
};

const validateFormData = (formData: any) => {
  const errors: Record<string, string> = {};

  formStructure.forEach((step) => {
    step.fields.forEach((field) => {
      const value = formData[field.prop];
      validateField(field, value, errors);
    });
  });

  // Check for unexpected fields in formData
  Object.keys(formData).forEach((key) => {
    const fieldExists = formStructure.some((step) =>
      step.fields.some((field) => field.prop === key)
    );

    if (!fieldExists) {
      errors[key] = `Unexpected field: ${key}`;
    }
  });

  return errors;
};

export const submitForm = (req: { body: any }, res: { json: (data: any) => void, status: (code: number) => { json: (data: any) => void } }): void => {
  const formData = req.body; // Get the submitted form data
  const errors = validateFormData(formData);

  console.log("Received formData:", formData);
  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // If no errors, respond with success
  return res.status(200).json({ success: true, message: 'Form validated successfully.' });
};
