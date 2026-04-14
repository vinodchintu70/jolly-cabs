export default function FormField({ label, error, touched, children }) {
  return (
    <div>
      {label && <label className="text-sm text-slate-400 mb-1 block">{label}</label>}
      {children}
      {touched && error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
