import formStructure from '../form.json';

export const submitForm = (req: { body: any }, res: { json: (data: any) => void, status: (code: number) => { json: (data: any) => void } }): void => {
  const formData = req.body; // Get the submitted form data
  const errors: Record<string, string> = {}; // Object to store validation errors

  console.log("Received formData:", formData);

  // Validate the form data against the form structure
  formStructure.forEach((step) => {
    step.fields.forEach((field) => {
      const { prop, label, validation } = field;
      const value = formData[prop];

      if (prop === 'school') {
        if (typeof value !== 'string' && typeof value !== 'number') {
          errors[prop] = `${label} must be either a string or a number.`;
        }
        return; // Skip further validation for 'school'
      }
      // Check if the field is missing in formData
      if (validation?.required && (value === undefined || value === null || value === '')) {
        errors[prop] = `${label} is required.`;
        return;
      }

      
      // Validate type-specific rules
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

        // Check additional rules, e.g., minLength or min
        if (validation?.minLength && typeof value === 'string' && value.length < validation.minLength) {
          errors[prop] = `${label} must be at least ${validation.minLength} characters long.`;
        }
        if (validation?.min && typeof value === 'number' && value < validation.min) {
          errors[prop] = `${label} must be at least ${validation.min}.`;
        }
      }
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

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // If no errors, respond with success
  res.status(200).json({ success: true, message: 'Form validated successfully.' });
};
