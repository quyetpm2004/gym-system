import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ModalForm.css';

export default function ModalForm({
  show,
  handleClose,
  title,
  fields = [],
  data = {},
  onSubmit
}) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="mf-overlay" onClick={handleClose}>
      <div className="mf-container" onClick={e => e.stopPropagation()}>
        <div className="mf-header">
          <h4>{title}</h4>
          <button className="mf-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <form className="mf-body" onSubmit={handleSave}>
          {fields.map((f, i) => {
            const val = formData[f.name] ?? '';
            return (
              <div className="mf-field" key={i}>
                <label>{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    name={f.name}
                    value={val}
                    onChange={handleChange}
                    required={f.required}
                  >
                    <option value="">-- Chọn --</option>
                    {f.options.map((opt, j) => (
                      <option key={j} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'radio' ? (
                  <div className="mf-radio-group">
                    {f.options.map((opt, j) => (
                      <label key={j} className="mf-radio">
                        <input
                          type="radio"
                          name={f.name}
                          value={opt.value}
                          checked={val === opt.value}
                          onChange={handleChange}
                          required={f.required}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={f.type || 'text'}
                    name={f.name}
                    placeholder={f.placeholder || ''}
                    value={val}
                    onChange={handleChange}
                    required={f.required}
                  />
                )}
              </div>
            );
          })}
          <div className="mf-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
