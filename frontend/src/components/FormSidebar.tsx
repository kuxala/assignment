interface FormSidebarProps {
  steps: any;
  selectedStep: number;
  setSelectedStep: React.Dispatch<React.SetStateAction<number>>; // Added to update selected step
}

export default function FormSidebar({
  steps,
  selectedStep,
  setSelectedStep,
}: FormSidebarProps) {
  const handleStepClick = (index: number) => {
    if (index <= selectedStep) {
      setSelectedStep(index); // Only allow clicking back to previous or current steps
    }
  };

  return (
    <div className="form-sidebar w-64 h-full p-6">
      <div className="form-sidebar-header mb-6">
        <h2 className="text-2xl font-semibold">Form Sidebar</h2>
      </div>
      <div className="form-sidebar-content">
        <ul className="space-y-4">
          {steps.map((step: { title: string }, index: number) => (
            <li
              key={index}
              onClick={() => handleStepClick(index)}
              className={`cursor-pointer hover:text-gray-400 ${
                selectedStep === index ? "font-bold text-blue-600" : ""
              } ${
                index > selectedStep ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {step.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
