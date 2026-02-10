import { useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Globe, Users, CheckCircle2 } from "lucide-react";
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
    "Narendra Modi", "Nirmala Sitharaman", "Amit Shah", "Dharmendra Pradhan", "Dr. Subrahmanyam Jaishankar",
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
  { value: "External Solo Delegates", label: "External Solo Delegates" },
  { value: "School Solo Delegates", label: "School Solo Delegates" },
  { value: "Internal Solo Delegates", label: "Internal Solo Delegates" },
  { value: "School Group Delegation", label: "School Group Delegation (4-7 members)" },
  { value: "Internal Group Delegation", label: "Internal Group Delegation (4-9 members)" },
  { value: "External Group Delegation", label: "External Group Delegation (4-9 members)" },
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

// Group size constraints
const GROUP_SIZE_LIMITS = {
  "School Group Delegation": { min: 4, max: 7 },
  "Internal Group Delegation": { min: 4, max: 9 },
  "External Group Delegation": { min: 4, max: 9 },
};

function Registration() {
  const navigate = useNavigate();
  const [registrationMode, setRegistrationMode] = useState(null); // null, 'delegate', 'oc'
  const [registrationType, setRegistrationType] = useState("");
  const [groupSize, setGroupSize] = useState(0);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [groupId, setGroupId] = useState("");

  // Array to hold all group member forms
  const [groupMembers, setGroupMembers] = useState([]);

  // Single member form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    yearOfStudy: "",
    rollNumber: "",
    munExperiences: "",
    munAwards: "",
    preferences: [
      { committee: "", countries: ["", "", ""] },
      { committee: "", countries: ["", "", ""] },
      { committee: "", countries: ["", "", ""] }
    ]
  });

  const [loading, setLoading] = useState(false);

  const isGroupRegistration = registrationType.includes("Group");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectChange = (field, value) => {
    if (field === "yearOfStudy") {
      setForm({ ...form, [field]: value });
    }
  };

  const handleRegistrationTypeChange = (value) => {
    setRegistrationType(value);
    setGroupSize(0);
    setCurrentMemberIndex(0);
    setGroupMembers([]);
    setGroupId("");
    setForm({
      name: "",
      email: "",
      phone: "",
      college: "",
      yearOfStudy: "",
      rollNumber: "",
      munExperiences: "",
      munAwards: "",
      preferences: [
        { committee: "", countries: ["", "", ""] },
        { committee: "", countries: ["", "", ""] },
        { committee: "", countries: ["", "", ""] }
      ]
    });
  };

  const handleGroupSizeChange = (size) => {
    const limits = GROUP_SIZE_LIMITS[registrationType];
    if (size >= limits.min && size <= limits.max) {
      setGroupSize(size);
      setCurrentMemberIndex(0);
      setGroupMembers([]);
      // Generate unique group ID
      setGroupId("GRP" + Date.now());
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

  const validateMemberForm = () => {
    if (!form.name || !form.email || !form.phone || !form.college || !form.yearOfStudy) {
      alert("Please fill all details including Year of Study.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email.");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Enter a valid 10-digit phone number.");
      return false;
    }

    if (registrationType.includes("Internal")) {
      if (!form.rollNumber) {
        alert("Please enter your Roll Number.");
        return false;
      }
    }

    // Validate MUN Experiences and Awards
    if (form.munExperiences === "" || form.munExperiences === null || form.munExperiences === undefined) {
      alert("Please enter the number of MUN Experiences (enter 0 if none).");
      return false;
    }

    if (form.munAwards === "" || form.munAwards === null || form.munAwards === undefined) {
      alert("Please enter the number of MUN Awards (enter 0 if none).");
      return false;
    }

    // Validate Preferences
    for (let i = 0; i < form.preferences.length; i++) {
      const pref = form.preferences[i];
      if (!pref.committee) {
        alert(`Please select a committee for Preference ${i + 1}`);
        return false;
      }

      const requiredCountries = pref.committee === "IP" ? 2 : 3;
      for (let j = 0; j < requiredCountries; j++) {
        if (!pref.countries[j]) {
          alert(`Please select ${pref.committee === "IP" ? "Portfolio" : "Country"} ${j + 1} for Preference ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const saveCurrentMemberAndNext = async () => {
    if (!validateMemberForm()) return;

    const newMembers = [...groupMembers, { ...form }];
    setGroupMembers(newMembers);

    if (currentMemberIndex < groupSize - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
      // Reset form for next member but keep college
      setForm({
        name: "",
        email: "",
        phone: "",
        college: form.college, // Keep the same college for group
        yearOfStudy: "",
        rollNumber: "",
        munExperiences: "",
        munAwards: "",
        preferences: [
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] }
        ]
      });
    } else {
      // All members filled, submit all
      await submitGroupRegistration(newMembers);
    }
  };

  const submitGroupRegistration = async (members) => {
    setLoading(true);
    try {
      const refId = "MUNIARE" + Date.now();
      const memberNames = members.map(m => m.name);

      // Store all group members in a single document
      await addDoc(collection(db, "registrations"), {
        isGroup: true,
        groupId: groupId,
        groupSize: groupSize,
        registrationType: registrationType,
        college: members[0].college,
        refId: refId,
        memberNames: memberNames,
        members: members.map((m, idx) => ({
          ...m,
          memberIndex: idx + 1,
          registrationType: registrationType,
        })),
        createdAt: serverTimestamp()
      });

      alert(`✅ Group Registration Successful! ${groupSize} members registered.`);
      navigate(`/payments?ref=${refId}`);

      // Reset everything
      setRegistrationType("");
      setGroupSize(0);
      setCurrentMemberIndex(0);
      setGroupMembers([]);
      setGroupId("");
      setForm({
        name: "",
        email: "",
        phone: "",
        college: "",
        yearOfStudy: "",
        rollNumber: "",
        munExperiences: "",
        munAwards: "",
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

  const submitSoloForm = async () => {
    if (!validateMemberForm()) return;

    setLoading(true);

    try {
      const refId = "MUNIARE" + Date.now();

      await addDoc(collection(db, "registrations"), {
        ...form,
        registrationType: registrationType,
        isGroup: false,
        refId,
        createdAt: serverTimestamp()
      });

      alert("✅ Registration Successful");
      navigate(`/payments?ref=${refId}`);

      setForm({
        name: "",
        email: "",
        phone: "",
        college: "",
        yearOfStudy: "",
        rollNumber: "",
        munExperiences: "",
        munAwards: "",
        preferences: [
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] },
          { committee: "", countries: ["", "", ""] }
        ]
      });
      setRegistrationType("");
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("❌ Registration Failed");
    }

    setLoading(false);
  };

  const getYearOptions = () => {
    if (registrationType === "School Solo Delegates" || registrationType === "School Group Delegation") {
      return GRADE_OPTIONS;
    }
    return YEAR_OPTIONS;
  };

  const getGroupSizeOptions = () => {
    const limits = GROUP_SIZE_LIMITS[registrationType];
    if (!limits) return [];
    const options = [];
    for (let i = limits.min; i <= limits.max; i++) {
      options.push({ value: i, label: `${i} Members` });
    }
    return options;
  };

  // Initial selection screen
  if (registrationMode === null) {
    return (
      <div className="registration">
        <div className="selection-section">
          <h2>Choose Registration Type</h2>
          <p className="selection-subtitle">Select how you want to participate in IARE MUN</p>

          <div className="selection-buttons">
            <button
              className="selection-btn delegate-btn"
              onClick={() => setRegistrationMode('delegate')}
            >
              <div className="btn-icon">
                <Globe size={48} />
              </div>
              <div className="btn-content">
                <h3>Register as Delegate</h3>
                <p>Represent a country in committee debates</p>
              </div>
            </button>

            <button
              className="selection-btn oc-btn"
              onClick={() => navigate('/register-oc')}
            >
              <div className="btn-icon">
                <Users size={48} />
              </div>
              <div className="btn-content">
                <h3>Register as OC</h3>
                <p>Join the Organizing Committee</p>
              </div>
            </button>
          </div>

          <div className="registration-guidelines">
            <h3>Registration Process</h3>
            <ul className="guidelines-list">
              <li>
                <CheckCircle2 size={20} className="guideline-icon" />
                <span>Choose your role (Delegate or OC) to begin</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="guideline-icon" />
                <span>Fill in your personal details and committee preferences</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="guideline-icon" />
                <span>Complete the secure payment to confirm your seat</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="guideline-icon" />
                <span>Receive your unique ID and await allocation updates</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="guideline-icon" />
                <span>You will receive a confirmation email within 48 hours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration">
      <div className="form-section">
        <button className="back-btn" onClick={() => {
          setRegistrationMode(null);
          setRegistrationType("");
          setGroupSize(0);
        }}>
          ← Back to Selection
        </button>

        <h2>Delegate Registration</h2>
        <p className="preference-note">
          Select 3 different committees and 3 unique countries for each.
        </p>

        {/* Registration Type Selection */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>Registration Type</label>
            <Select
              value={registrationType ? { value: registrationType, label: REGISTRATION_TYPES.find(t => t.value === registrationType)?.label } : null}
              onChange={(selected) => handleRegistrationTypeChange(selected?.value || "")}
              options={REGISTRATION_TYPES}
              placeholder="Select Registration Type"
              styles={customSelectStyles}
            />
          </div>
        </div>

        {/* Group Size Selection for Group Registrations */}
        {isGroupRegistration && registrationType && (
          <div className="form-row">
            <div className="form-group full-width">
              <label>Number of Team Members</label>
              <Select
                value={groupSize ? { value: groupSize, label: `${groupSize} Members` } : null}
                onChange={(selected) => handleGroupSizeChange(selected?.value || 0)}
                options={getGroupSizeOptions()}
                placeholder="Select number of members in your group"
                styles={customSelectStyles}
              />
              <p className="group-info">
                {registrationType === "School Group Delegation"
                  ? "Minimum 4, Maximum 7 members"
                  : "Minimum 4, Maximum 9 members"}
              </p>
            </div>
          </div>
        )}

        {/* Group Progress Indicator */}
        {isGroupRegistration && groupSize > 0 && (
          <div className="group-progress">
            <h3>Registering Member {currentMemberIndex + 1} of {groupSize}</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentMemberIndex + 1) / groupSize) * 100}%` }}
              ></div>
            </div>
            <div className="members-registered">
              {groupMembers.map((m, idx) => (
                <span key={idx} className="member-tag">✓ {m.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Show form only when type is selected (and group size for groups) */}
        {registrationType && (!isGroupRegistration || groupSize > 0) && (
          <>
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
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  disabled={isGroupRegistration && currentMemberIndex > 0}
                />
              </div>
              {registrationType.includes("Internal") && (
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value.toUpperCase() })}

                  />
                </div>
              )}
              <div className="form-group">
                <label>
                  {(registrationType === "School Solo Delegates" || registrationType === "School Group Delegation")
                    ? "Grade/Standard"
                    : "Year of Study"}
                </label>
                <Select
                  value={form.yearOfStudy ? { value: form.yearOfStudy, label: form.yearOfStudy } : null}
                  onChange={(selected) => handleSelectChange("yearOfStudy", selected?.value || "")}
                  options={getYearOptions()}
                  placeholder={(registrationType === "School Solo Delegates" || registrationType === "School Group Delegation")
                    ? "Select Grade"
                    : "Select Year"}
                  styles={customSelectStyles}
                />
              </div>
              <div className="form-group">
                <label>No. of MUN Experiences</label>
                <input
                  name="munExperiences"
                  type="number"
                  min="0"
                  value={form.munExperiences}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>No. of MUN Awards</label>
                <input
                  name="munAwards"
                  type="number"
                  min="0"
                  value={form.munAwards}
                  onChange={handleChange}
                  placeholder="0"
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
              {isGroupRegistration ? (
                <button
                  className="btn-submit"
                  onClick={saveCurrentMemberAndNext}
                  disabled={loading || !form.name || !form.email || !form.phone || !form.college || !form.yearOfStudy}
                >
                  {loading
                    ? "Submitting..."
                    : currentMemberIndex < groupSize - 1
                      ? `Save & Continue to Member ${currentMemberIndex + 2}`
                      : `Submit All ${groupSize} Members`}
                </button>
              ) : (
                <button
                  className="btn-submit"
                  onClick={submitSoloForm}
                  disabled={loading || !form.name || !form.email || !form.phone || !form.college || !form.yearOfStudy}
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;
