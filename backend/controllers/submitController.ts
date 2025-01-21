import formStructure from '../form.json';

// Route to submit form data
export const submitForm = (req: { body: any }, res: { json: (data: any) => void, status: (code: number) => { json: (data: any) => void } }): void => {
  const formData = req.body; // Get the submitted form data
  const errors: Record<string, string> = {};

  // Validate the form data against the form structure
  formStructure.forEach((step) => {
    step.fields.forEach((field) => {
      const { prop, label, validation } = field;
      const value = formData[prop];

      // Validate required fields
      if (validation?.required && (value === undefined || value === null || value === '')) {
        errors[prop] = `${label} is required.`;
        return;
      }

      // Type-specific validations
      if (validation?.type === 'string') {
        if (typeof value !== 'string') {
          errors[prop] = `${label} must be a string.`;
        } else if (validation.minLength && value.length < validation.minLength) {
          errors[prop] = `${label} must be at least ${validation.minLength} characters long.`;
        }
      }

      if (validation?.type === 'email') {
        if (typeof value !== 'string') {
          errors[prop] = `${label} must be a valid email.`;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[prop] = `${label} is not a valid email address.`;
          }
        }
      }

      if (validation?.type === 'number') {
        if (typeof value !== 'number') {
          errors[prop] = `${label} must be a number.`;
        } else if (validation.min && value < validation.min) {
          errors[prop] = `${label} must be at least ${validation.min}.`;
        }
      }
    });
  });

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // If no errors, respond with success
  res.status(200).json({ success: true, message: 'Form submitted successfully.' });
};
