import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validate) {
      const errs = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const errs = validate(values);
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const validateAll = () => {
    if (!validate) return true;
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return Object.keys(errs).length === 0;
  };

  const reset = () => { setValues(initialValues); setErrors({}); setTouched({}); };

  return { values, errors, touched, handleChange, handleBlur, validateAll, reset, setValues };
};
