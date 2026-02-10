import { useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "var(--ink-black)",
        borderColor: state.isFocused ? "var(--cornflower-ocean)" : "var(--yale-blue)",
        minHeight: "3rem",
        borderRadius: "8px",
        boxShadow: state.isFocused ? `0 0 0 1px var(--cornflower-ocean)` : "none",
        color: "white",
    }),
    singleValue: (provided) => ({ ...provided, color: "white" }),
    input: (provided) => ({ ...provided, color: "white" }),
    placeholder: (provided) => ({ ...provided, color: "rgba(255, 255, 255, 0.5)" }),
    menu: (provided) => ({ ...provided, backgroundColor: "var(--deep-space-blue)", borderRadius: "8px", zIndex: 1000 }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "var(--cornflower-ocean)" : "var(--deep-space-blue)",
        color: "white",
        padding: "0.8rem 1rem",
    }),
    dropdownIndicator: (provided) => ({ ...provided, color: "white" }),
    indicatorSeparator: () => ({ display: "none" }),
};

const OC_TYPES = [
    { value: "Internal OC", label: "Internal OC" },
    { value: "External OC", label: "External OC" },
];

const YEAR_OPTIONS = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
];

function OCRegistration() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        ocType: "",
        yearOfStudy: "",
        rollNumber: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSelectChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const submitForm = async () => {
        if (!form.name || !form.email || !form.phone || !form.college || !form.ocType || !form.yearOfStudy) {
            alert("Please fill all details.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            alert("Please enter a valid email.");
            return;
        }

        if (!/^\d{10}$/.test(form.phone)) {
            alert("Enter a valid 10-digit phone number.");
            return;
        }

        if (form.ocType === "Internal OC" && !form.rollNumber) {
            alert("Please enter your Roll Number.");
            return;
        }

        setLoading(true);

        try {
            // Create a unique reference ID for payment
            const refId = "MUNOC" + Date.now();

            await addDoc(collection(db, "oc_registrations"), {
                ...form,
                registrationType: form.ocType,
                refId,
                createdAt: serverTimestamp()
            });

            alert("✅ OC Registration Successful");

            // Redirect to Payments page with reference ID
            navigate(`/payments?ref=${refId}&type=oc`);

            setForm({
                name: "",
                email: "",
                phone: "",
                college: "",
                ocType: "",
                yearOfStudy: "",
                rollNumber: "",
            });
        } catch (error) {
            console.error("Firestore Error:", error);
            alert("❌ Registration Failed");
        }

        setLoading(false);
    };

    return (
        <div className="registration">
            <div className="form-section">
                <button className="back-btn" onClick={() => navigate('/register')}>
                    ← Back to Selection
                </button>

                <h2>Organizing Committee Registration</h2>
                <p className="preference-note">
                    Join the IARE MUN Organizing Committee
                </p>

                <div className="form-row">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input name="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>College Name</label>
                        <input name="college" value={form.college} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>OC Type</label>
                        <Select
                            value={form.ocType ? { value: form.ocType, label: form.ocType } : null}
                            onChange={(selected) => handleSelectChange("ocType", selected?.value || "")}
                            options={OC_TYPES}
                            placeholder="Select OC Type"
                            styles={customSelectStyles}
                        />
                    </div>
                    <div className="form-group">
                        <label>Year of Study</label>
                        <Select
                            value={form.yearOfStudy ? { value: form.yearOfStudy, label: form.yearOfStudy } : null}
                            onChange={(selected) => handleSelectChange("yearOfStudy", selected?.value || "")}
                            options={YEAR_OPTIONS}
                            placeholder="Select Year"
                            isDisabled={!form.ocType}
                            styles={customSelectStyles}
                        />
                    </div>
                    {form.ocType === "Internal OC" && (
                        <div className="form-group">
                            <label>Roll Number</label>
                            <input
                                name="rollNumber"
                                value={form.rollNumber}
                                onChange={(e) => setForm({ ...form, rollNumber: e.target.value.toUpperCase() })}

                            />
                        </div>
                    )}
                </div>

                {/* OC Pricing Info */}
                <div className="pricing-info">
                    <h3>Registration Fee</h3>
                    <div className="pricing-grid">
                        <div className="price-card">
                            <h4>Internal OC</h4>
                            <p>1st Year: <strong>₹799</strong></p>
                            <p>2nd/3rd/4th Year: <strong>₹899</strong></p>
                        </div>
                        <div className="price-card">
                            <h4>External OC</h4>
                            <p>1st Year: <strong>₹899</strong></p>
                            <p>2nd/3rd/4th Year: <strong>₹999</strong></p>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className="btn-submit"
                        onClick={submitForm}
                        disabled={loading || !form.name || !form.email || !form.phone || !form.college || !form.ocType || !form.yearOfStudy}
                    >
                        {loading ? "Submitting..." : "Submit Registration"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OCRegistration;
