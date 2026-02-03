import { useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";
import { useNavigate } from "react-router-dom"; // <-- Import for redirection
import "./Registration.css";

const COMMITTEE_COUNTRIES = {
  UNSC: [
    "China",
    "France",
    "Russian Federation",
    "United Kingdom",
    "United States",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Angola",
    "Argentina",
    "Australia",
    "Austria",
    "Bahrain",
    "Bangladesh",
    "Belgium",
    "Bolivia",
    "Brazil",
    "Bulgaria",
    "Canada",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Democratic Republic of the Congo",
    "Denmark",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Ethiopia",
    "Finland",
    "Gabon",
    "Ghana",
    "Greece",
    "Guatemala",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Latvia",
    "Lebanon",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Mexico",
    "Morocco",
    "Namibia",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Panama",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Saudi Arabia",
    "Senegal",
    "Somalia",
    "South Africa",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "Uruguay",
    "Venezuela",
    "Zimbabwe"
  ],
  DISEC: [
    "China",
    "France",
    "Russian Federation",
    "United Kingdom",
    "United States",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Angola",
    "Argentina",
    "Australia",
    "Austria",
    "Bahrain",
    "Bangladesh",
    "Belgium",
    "Bolivia",
    "Brazil",
    "Bulgaria",
    "Canada",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Democratic Republic of the Congo",
    "Denmark",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Ethiopia",
    "Finland",
    "Gabon",
    "Ghana",
    "Greece",
    "Guatemala",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Latvia",
    "Lebanon",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Mexico",
    "Morocco",
    "Namibia",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Panama",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Saudi Arabia",
    "Senegal",
    "Somalia",
    "South Africa",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "Uruguay",
    "Venezuela",
    "Zimbabwe"
  ],
  AIPPM: [
    "Nirmala Sitharaman", "Amit Shah", "Dharmendra Pradhan", "Dr. Subrahmanyam Jaishankar",
    "Ashwini Vaishnaw", "Anupriya Devi", "Jyotiraditya M. Scindia", "Jagat Prakash Nadda",
    "Tejasvi Surya", "Rajnath Singh", "K Annamalai", "Yogi Adityanath", "Kangana Ranaut",
    "Eknath Shinde", "Chirag Paswan", "Edapaddi Palaniswami", "H.D. Kumaraswamy",
    "Nitish Kumar", "Nara Chandrababu Naidu", "Jayant Chaudhary", "Ramdas Athawale",
    "Rahul Gandhi", "Mallikarjun Kharge", "Siddaramaiah", "D.K. Shivakumar",
    "Priyanka Gandhi Vadra", "Shashi Tharoor", "Revanth Reddy", "Atishi Marlena",
    "Pinarayi Vijayan", "Uddhav Balasaheb Thackeray", "M.K. Stalin", "Udhayanidhi Stalin",
    "Omar Abdullah", "Mehbooba Mufti", "Hemant Soren", "Asaduddin Owaisi",
    "YS Jagan Mohan Reddy", "Akhilesh Yadav", "K Chandrashekar Rao", "Sachin Pilot",
    "Mamata Banerjee", "Y. V. Subba Reddy", "Meda Raghunath Reddy", "Golla Baburao",
    "S. Niranjan Reddy", "Alla Ayodhya Rami Reddy", "Parimal Nathwani",
    "Pilli Subhash Chandra Bose", "R. Krishnaiah", "Beeda Masthan Rao", "Sana Satish",
    "Nabam Rebia", "Bhubaneswar Kalita", "Birendra Prasad Baishya", "Pabitra Margherita",
    "Sarbananda Sonowal", "Kamakhya Prasad Tasa", "Ajit Kumar Bhuyan", "Dharamshila Gupta",
    "Bhim Singh", "Satish Chandra Dubey", "Shambhu Sharan Patel", "Manan Kumar Mishra",
    "Manoj Jha", "Sanjay Yadav", "Faiyaz Ahmad", "Prem Chand Gupta", "Amarendra Dhari Singh",
    "Sanjay Kumar Jha", "Khiru Mahto", "Harivansh Narayan Singh", "Ram Nath Thakur",
    "Akhilesh Prasad Singh", "Upendra Kushwaha", "Devendra Pratap Singh", "Rajeev Shukla",
    "Ranjeet Ranjan", "Phulo Devi Netam", "K.T.S. Tulsi", "Sanjay Singh",
    "Narain Dass Gupta", "Raghav Chadha", "Sadanand Shet Tanavade", "J. P. Nadda",
    "Jasvantsinh Salinkumar", "Mayankkumar Nayak", "Babubhai Desai", "Kesridevsinh Jhala",
    "Shaktisinh Gohil", "Narhari Amin", "Ramilaben Bara", "Rambhai Mokariya",
    "Parshottam Rupala", "Mansukh Mandaviya", "Subhash Barala", "Rekha Sharma",
    "Ram Chander Jangra", "Kiran Chaudhary", "Kartikeya Sharma", "Harsh Mahajan",
    "Indu Goswami", "Sikander Kumar", "Dr. Sarfraz Ahmad", "Pradeep Varma",
    "Aditya Sahu", "Mahua Maji", "Deepak Prakash", "Ajay Maken", "G. C. Chandrashekhar",
    "Syed Nasir Hussain", "Narayansa Bhandage", "H. D. Deve Gowda", "Iranna Kadadi",
    "K. Narayan", "Jose K. Mani", "P. P. Suneer", "Haris Beeran", "Abdul Wahab",
    "V. Sivadasan", "John Brittas", "A. A. Rahim", "Jebi Mather Hisham", "Sandosh Kumar",
    "Maya Naroliya", "Banshilal Gurjar", "Umesh Nath Maharaj", "L. Murugan",
    "George Kurian", "Sumitra Balmik", "Kavita Patidar", "Ashok Chavan", "Praful Patel",
    "Milind Deora", "Sunetra Pawar", "Sharad Pawar", "Priyanka Chaturvedi",
    "Bhagwat Karad", "Dhairyashil Patil", "Fouzia Khan", "Mamata Mohanta", "Sujeet Kumar",
    "Munna Khan", "Niranjan Bishi", "Sonia Gandhi", "Chunnilal Garasiya", "Madan Rathore",
    "Randeep Surjewala", "Mukul Wasnik", "Neeraj Dangi", "Jaya Bachchan",
    "Sudhanshu Trivedi", "R. P. N. Singh", "Chaudhary Tejveer Singh", "Amarpal Maurya",
    "Sangeeta Balwant", "Sadhna Singh", "Naveen Jain", "Ramji Lal Suman"
  ],
  IP: [
    "Reporter",
    "Photo Journalist"
  ]
};

const COMMITTEES = Object.keys(COMMITTEE_COUNTRIES);

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

const REGISTRATION_TYPES = [
  { value: "External Solo Delegation", label: "External Solo Delegation" },
  { value: "School Solo Delegation", label: "School Solo Delegation" },
  { value: "Internal Solo Delegation", label: "Internal Solo Delegation" },
];

const YEAR_OPTIONS = [
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
];

const GRADE_OPTIONS = [
  { value: "8th Grade", label: "8th Grade" },
  { value: "9th Grade", label: "9th Grade" },
  { value: "10th Grade", label: "10th Grade" },
  { value: "11th Grade", label: "11th Grade" },
  { value: "12th Grade", label: "12th Grade" },
];

/*
function Registration() {
  const navigate = useNavigate(); // <-- Hook to redirect
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    registrationType: "",
    yearOfStudy: "",
    preferences: [
      { committee: "", countries: ["", "", ""] },
      { committee: "", countries: ["", "", ""] },
      { committee: "", countries: ["", "", ""] }
    ]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectChange = (field, value) => {
    // Reset yearOfStudy if registrationType changes
    if (field === "registrationType") {
      setForm({ ...form, registrationType: value, yearOfStudy: "" });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleCommitteeChange = (index, value) => {
    const updated = [...form.preferences];
    const duplicate = form.preferences.some((p, i) => i !== index && p.committee === value);
    if (duplicate) {
      alert("This committee is already selected in another preference!");
      return;
    }
    updated[index] = { committee: value, countries: ["", "", ""] };
    setForm({ ...form, preferences: updated });
  };

  const handleCountryChange = (pi, ci, value) => {
    const updated = [...form.preferences];
    if (updated[pi].countries.includes(value)) {
      alert("This country is already selected in this preference!");
      return;
    }
    updated[pi].countries[ci] = value;
    setForm({ ...form, preferences: updated });
  };

  const availableCommittees = (index) =>
    COMMITTEES.filter((c) => !form.preferences.some((p, i) => i !== index && p.committee === c));

  const submitForm = async () => {
    if (!form.name || !form.email || !form.phone || !form.college || !form.registrationType || !form.yearOfStudy) {
      alert("Please fill all details including Registration Type and Year of Study.");
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

    setLoading(true);

    try {
      const q = query(collection(db, "registrations"), where("email", "==", form.email));
      const existing = await getDocs(q);

      if (!existing.empty) {
        alert("This email is already registered!");
        setLoading(false);
        return;
      }

      // Create a unique reference ID for payment
      const refId = "MUNIARE" + Date.now();

      await addDoc(collection(db, "registrations"), {
        ...form,
        refId, // <-- store reference ID in Firestore
        createdAt: serverTimestamp()
      });

      alert("✅ Registration Successful");

      // Redirect to Payments page with reference ID
      navigate(`/payments?ref=${refId}`);

      setForm({
        name: "",
        email: "",
        phone: "",
        college: "",
        registrationType: "",
        yearOfStudy: "",
        preferences: [
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] }
        ]
      });
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("❌ Registration Failed");
    }

    setLoading(false);
  };

  const getYearOptions = () => {
    if (form.registrationType === "School Solo Delegation") {
      return GRADE_OPTIONS;
    }
    return YEAR_OPTIONS;
  };

  return (
    <div className="registration">
      <div className="form-section">
        <h2>Delegate Registration</h2>
        <p className="preference-note">
          Select 3 different committees and 3 unique countries for each.
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
            <label>College/School</label>
            <input name="college" value={form.college} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Registration Type</label>
            <Select
              value={form.registrationType ? { value: form.registrationType, label: form.registrationType } : null}
              onChange={(selected) => handleSelectChange("registrationType", selected?.value || "")}
              options={REGISTRATION_TYPES}
              placeholder="Select Type"
              styles={customSelectStyles}
            />
          </div>
          <div className="form-group">
            <label>
              {form.registrationType === "School Solo Delegation" ? "Grade/Standard" : "Year of Study"}
            </label>
            <Select
              value={form.yearOfStudy ? { value: form.yearOfStudy, label: form.yearOfStudy } : null}
              onChange={(selected) => handleSelectChange("yearOfStudy", selected?.value || "")}
              options={getYearOptions()}
              placeholder={form.registrationType === "School Solo Delegation" ? "Select Grade" : "Select Year"}
              isDisabled={!form.registrationType}
              styles={customSelectStyles}
            />
          </div>
        </div>

        {form.preferences.map((pref, pi) => (
          <div key={pi} className="preference-group">
            <h3>Preference {pi + 1}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Committee</label>
                <Select
                  value={pref.committee ? { value: pref.committee, label: pref.committee } : null}
                  onChange={(selected) => handleCommitteeChange(pi, selected?.value || "")}
                  options={availableCommittees(pi).map((c) => ({ value: c, label: c }))}
                  placeholder="Select Committee"
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                />
              </div>
              {pref.countries
                .slice(0, pref.committee === "IP" ? 2 : 3)
                .map((country, ci) => (
                  <div key={ci} className="form-group">
                    <label>{pref.committee === "IP" ? "Portfolio" : "Country"} {ci + 1}</label>
                    <Select
                      isDisabled={!pref.committee}
                      value={country ? { value: country, label: country } : null}
                      onChange={(selected) => handleCountryChange(pi, ci, selected?.value || "")}
                      options={
                        pref.committee
                          ? COMMITTEE_COUNTRIES[pref.committee]
                            .filter((c) => !pref.countries.includes(c) || c === country)
                            .map((c) => ({ value: c, label: c }))
                          : []
                      }
                      placeholder={pref.committee === "IP" ? "Select Portfolio" : "Select or search country"}
                      isClearable
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button
            className="btn-submit"
            onClick={submitForm}
            disabled={loading || !form.name || !form.email || !form.phone || !form.college || !form.registrationType || !form.yearOfStudy}
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}
*/

function Registration() {
  return (
    <div className="registration">
      <section className="page-header">
        <div className="container">
          <h1>Delegate Registration</h1>
          <p>Register for IARE MUN 2026</p>
        </div>
      </section>

      <section className="section registration-soon-section">
        <div className="container">
          <div className="registration-soon-content">
            <div className="soon-card">

              <h2>Registrations Opening Soon</h2>
              <p className="soon-text">
                Prepare yourself for the ultimate diplomatic experience.
                Delegate applications for IARE MUN 2026 will be live shortly.
              </p>
              <div className="updates-box">
                <p>Stay tuned for updates!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default Registration;
