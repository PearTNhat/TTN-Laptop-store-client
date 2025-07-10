// Helper sub-components for the form
const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div>
    <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
      {Icon && <Icon className="text-gray-500" />}
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

export default InputField;
