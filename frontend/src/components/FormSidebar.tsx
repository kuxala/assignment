interface FormSidebarProps {
  steps: any;
  selectedStep: number;
}

export default function FormSidebar({ steps, selectedStep }: FormSidebarProps) {
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
              className={`cursor-pointer hover:text-gray-400 ${
                selectedStep === index ? "font-bold text-blue-600" : ""
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
