import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { db, auth } from "../firebase";
import { staticCountryData } from "../data/committees";
import "./Admin.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    LayoutDashboard, Users, CheckCircle, Globe, CreditCard, Search, LogOut, FileText
} from 'lucide-react';

function Admin() {
    const [delegates, setDelegates] = useState([]);
    const [countryData, setCountryData] = useState(staticCountryData);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("home");
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setNotification(null);
        try {
            console.log("Attempting login with session persistence...");
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login promise resolved");
        } catch (err) {
            console.error("Login error:", err);
            setNotification(err.message || "Invalid credentials!");
        } finally {
            setIsLoggingIn(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            if (currentUser) {
                fetchAndAllocate();
            }
        });

        // Logout on tab close (Session Persistence handles this, but we can also add a listener)
        const handleTabClose = () => {
            // signOut(auth); // Async, might not finish. Session persistence is better.
        };
        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            unsubscribe();
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    // Inactivity Timeout (5 minutes)
    useEffect(() => {
        if (!user) return;

        let inactivityTimer;
        const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

        const resetTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                handleLogout();
                setNotification("Session expired due to 5 minutes of inactivity.");
            }, INACTIVITY_LIMIT);
        };

        const activityEvents = [
            'mousedown', 'mousemove', 'keydown',
            'scroll', 'touchstart', 'click'
        ];

        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [user]);

    const fetchAndAllocate = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "registrations"));
            const delegateList = [];

            querySnapshot.forEach(docSnap => {
                const data = docSnap.data();
                delegateList.push({
                    id: docSnap.id,
                    name: data.name,
                    email: data.email,
                    college: data.college,
                    phone: data.phone,
                    registrationType: data.registrationType || "-",
                    yearOfStudy: data.yearOfStudy || "-",
                    amountToPay: data.amountToPay || "-",
                    refId: data.refId || "-",
                    utr: data.utr || "-",
                    verified: data.verified || false,
                    timestamp: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.timestamp || new Date(0).toISOString()),
                    paidAt: data.paidAt?.toDate?.() ? data.paidAt.toDate().toISOString() : null,
                    preferences: data.preferences || [],
                    allocation: null
                });
            });

            delegateList.sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            const newCountryData = {};
            Object.keys(staticCountryData).forEach(committee => {
                newCountryData[committee] = staticCountryData[committee].map(c => ({
                    ...c,
                    is_allocated: false,
                    allocated_to: null
                }));
            });

            delegateList.forEach(delegate => {
                if (delegate.allocation) return;
                for (const pref of delegate.preferences) {
                    const committee = pref.committee;
                    for (const country of pref.countries) {
                        const index = newCountryData[committee]?.findIndex(
                            c => c.country === country
                        );
                        if (
                            index !== -1 &&
                            !newCountryData[committee][index].is_allocated
                        ) {
                            newCountryData[committee][index].is_allocated = true;
                            newCountryData[committee][index].allocated_to = delegate.name;
                            delegate.allocation = { committee, country };
                            return;
                        }
                    }
                }
            });

            setDelegates(delegateList);
            setCountryData(newCountryData);

            // Save to localStorage for immediate admin view
            localStorage.setItem(
                "mun_country_matrix",
                JSON.stringify(newCountryData)
            );

            // Sync to Firestore for public view
            try {
                await setDoc(doc(db, "public", "countryMatrix"), {
                    matrix: newCountryData,
                    lastUpdated: new Date().toISOString()
                });
                console.log("Country matrix synced to Firestore");
            } catch (syncErr) {
                console.error("Error syncing matrix to Firestore:", syncErr);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setNotification("Error fetching delegates!");
            setLoading(false);
        }
    };





    const verifyPayment = async delegateId => {
        try {
            await updateDoc(doc(db, "registrations", delegateId), {
                verified: true
            });
            setDelegates(prev =>
                prev.map(d =>
                    d.id === delegateId ? { ...d, verified: true } : d
                )
            );
            alert("Payment verified");
        } catch (err) {
            console.error(err);
            alert("Failed to verify payment");
        }
    };

    const exportToCSV = () => {
        if (delegates.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = [
            "Reg Time", "Name", "Email", "Phone", "College/School", "Reg Type", "Year/Grade",
            "Pref 1: Committee", "Pref 1: Country 1", "Pref 1: Country 2", "Pref 1: Country 3",
            "Pref 2: Committee", "Pref 2: Country 1", "Pref 2: Country 2", "Pref 2: Country 3",
            "Pref 3: Committee", "Pref 3: Country 1", "Pref 3: Country 2", "Pref 3: Country 3",
            "Ref ID", "Amount", "UTR", "Paid At", "Status", "Allocation"
        ];

        const rows = delegates.map(d => {
            const prefsColumns = [];
            [0, 1, 2].forEach(i => {
                const p = d.preferences[i];
                if (p) {
                    prefsColumns.push(p.committee);
                    prefsColumns.push(p.countries[0] || "-");
                    prefsColumns.push(p.countries[1] || "-");
                    prefsColumns.push(p.countries[2] || "-");
                } else {
                    prefsColumns.push("-", "-", "-", "-");
                }
            });

            const allocationStr = d.allocation ? `${d.allocation.committee} (${d.allocation.country})` : "-";
            const paidAtStr = d.paidAt ? new Date(d.paidAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/,/g, "") : "-";

            return [
                new Date(d.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/,/g, ""),
                d.name,
                d.email,
                d.phone,
                d.college,
                d.registrationType,
                d.yearOfStudy,
                ...prefsColumns,
                d.refId,
                d.amountToPay,
                d.utr,
                paidAtStr,
                d.verified ? "Verified" : (d.utr !== "-" ? "Paid" : "Pending"),
                allocationStr
            ].map(field => `"${field}"`); // Escape fields
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "delegates_data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (authLoading)
        return <div className="admin-loading">Verifying Session...</div>;

    if (!user) {
        return (
            <div className="admin-login-overlay">
                <div className="login-card">
                    <h2>Admin Authentication</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoggingIn}>
                            {isLoggingIn ? "Authenticating..." : "Unlock Dashboard"}
                        </button>
                    </form>
                    {notification && (
                        <div className="login-error">{notification}</div>
                    )}
                </div>
            </div>
        );
    }

    if (loading)
        return <div className="admin-loading">Loading Admin Panel...</div>;



    const paidDelegates = delegates.filter(d => d.utr !== "-");
    const verifiedDelegates = delegates.filter(d => d.verified);
    const searchedDelegates = delegates.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.refId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Chart Data Calculations
    const regTypeData = [
        { name: 'External', value: delegates.filter(d => d.registrationType?.includes('External')).length },
        { name: 'Internal', value: delegates.filter(d => d.registrationType?.includes('Internal')).length },
        { name: 'School', value: delegates.filter(d => d.registrationType?.includes('School')).length },
    ].filter(d => d.value > 0);

    const paymentData = [
        { name: 'Verified', value: verifiedDelegates.length },
        { name: 'Paid (Pending Verify)', value: paidDelegates.length - verifiedDelegates.length },
        { name: 'Not Paid', value: delegates.length - paidDelegates.length },
    ].filter(d => d.value > 0);

    const committeeStats = {};
    delegates.forEach(d => {
        if (d.allocation && d.allocation.committee) {
            committeeStats[d.allocation.committee] = (committeeStats[d.allocation.committee] || 0) + 1;
        }
    });
    const committeeData = Object.keys(committeeStats).map(name => ({
        name,
        count: committeeStats[name]
    }));

    const COLORS = ['#d4af37', '#4ade80', '#ff4444', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="admin-layout">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <LayoutDashboard size={24} color="#d4af37" />
                    </div>
                    <h2>MUN Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${selectedTab === "home" ? "active" : ""}`}
                        onClick={() => setSelectedTab("home")}
                    >
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "delegate_info" ? "active" : ""} `}
                        onClick={() => setSelectedTab("delegate_info")}
                    >
                        <FileText size={18} />
                        <span>Delegate Info</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "allocated_delegates" ? "active" : ""} `}
                        onClick={() => setSelectedTab("allocated_delegates")}
                    >
                        <Users size={18} />
                        <span>Allocated</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "countries" ? "active" : ""} `}
                        onClick={() => setSelectedTab("countries")}
                    >
                        <Globe size={18} />
                        <span>Countries</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "delegates" ? "active" : ""} `}
                        onClick={() => setSelectedTab("delegates")}
                    >
                        <CreditCard size={18} />
                        <span>Payments</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "verified" ? "active" : ""} `}
                        onClick={() => setSelectedTab("verified")}
                    >
                        <CheckCircle size={18} />
                        <span>Verified</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "search" ? "active" : ""} `}
                        onClick={() => setSelectedTab("search")}
                    >
                        <Search size={18} />
                        <span>Search</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn-minimal" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                {notification && (
                    <div className="admin-notification-sticky">
                        <span>{notification}</span>
                        <button onClick={() => setNotification(null)}>×</button>
                    </div>
                )}

                <header className="content-header">
                    <div className="header-text">
                        <h1>Dashboard</h1>
                        <p>Welcome back, Admin</p>
                    </div>
                    <div className="header-actions">
                        <button className="logout-header-btn" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {selectedTab === "home" && (
                    <>
                        {/* Stats Section */}
                        <section className="stats-section container">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Total Delegates</h3>
                                    <p>{delegates.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Paid</h3>
                                    <p>{paidDelegates.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Verified</h3>
                                    <p>{verifiedDelegates.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Allocated</h3>
                                    <p>{delegates.filter(d => d.allocation).length}</p>
                                </div>
                            </div>
                        </section>

                        {/* Charts Section */}
                        <section className="charts-section container">
                            <div className="charts-grid">
                                <div className="chart-card">
                                    <h3>Registration Types</h3>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={regTypeData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {regTypeData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #d4af37' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="chart-card">
                                    <h3>Payment Status</h3>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={paymentData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {paymentData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #d4af37' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {committeeData.length > 0 && (
                                    <div className="chart-card full-width">
                                        <h3>Committee Allocations</h3>
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={committeeData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                    <XAxis dataKey="name" stroke="#d4af37" />
                                                    <YAxis stroke="#d4af37" />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #d4af37' }}
                                                        itemStyle={{ color: '#fff' }}
                                                    />
                                                    <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}



                <section className="section">
                    <div className="container">

                        {selectedTab === "delegate_info" && (
                            <div className="admin-table-container custom-scrollbar">
                                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", position: "sticky", left: 0 }}>
                                    <button className="export-btn" onClick={exportToCSV}>
                                        Export to Excel
                                    </button>
                                </div>
                                <table className="admin-table full-width">
                                    <thead>
                                        <tr>
                                            <th>Reg Time</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Year/Grade</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>College/School</th>
                                            <th>Pref 1</th>
                                            <th>Pref 2</th>
                                            <th>Pref 3</th>
                                            <th>Ref ID</th>
                                            <th>Amount</th>
                                            <th>UTR</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {delegates.map(d => (
                                            <tr key={d.id}>
                                                <td>{new Date(d.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                                                <td>{d.name}</td>
                                                <td>{d.registrationType}</td>
                                                <td>{d.yearOfStudy}</td>
                                                <td>{d.email}</td>
                                                <td>{d.phone}</td>
                                                <td>{d.college}</td>
                                                {[0, 1, 2].map(i => {
                                                    const pref = d.preferences[i];
                                                    return (
                                                        <td key={i}>
                                                            {pref
                                                                ? `${pref.committee} - ${pref.countries.join(", ")}`
                                                                : "-"}
                                                        </td>
                                                    );
                                                })}
                                                <td>{d.refId}</td>
                                                <td>{d.amountToPay}</td>
                                                <td>{d.utr}</td>
                                                <td>
                                                    <span className={`status-tag ${d.verified ? "verified" : (d.utr !== "-" ? "paid" : "pending")}`}>
                                                        {d.verified ? "Verified" : (d.utr !== "-" ? "Paid" : "Pending")}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedTab === "allocated_delegates" && (
                            <table className="admin-table full-width">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Committee</th>
                                        <th>Country/Portfolio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {delegates
                                        .filter(d => d.allocation)
                                        .map(d => (
                                            <tr key={d.id}>
                                                <td>{d.name}</td>
                                                <td>{d.phone}</td>
                                                <td>{d.email}</td>
                                                <td>{d.allocation.committee}</td>
                                                <td>{d.allocation.country}</td>
                                            </tr>
                                        ))}
                                    {delegates.filter(d => d.allocation).length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No delegates allocated yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {selectedTab === "countries" &&
                            Object.keys(countryData).map(committee => (
                                <div key={committee} className="country-table-section">
                                    <h3>{committee}</h3>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Country</th>
                                                <th>Allocated To</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {countryData[committee].map(c => (
                                                <tr key={c.country}>
                                                    <td>{c.country}</td>
                                                    <td>{c.allocated_to || "-"}</td>
                                                    <td>
                                                        {c.is_allocated ? "Allocated" : "Available"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}

                        {selectedTab === "delegates" && (
                            <table className="admin-table full-width">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Year</th>
                                        <th>Phone</th>
                                        <th>Ref ID</th>

                                        <th>UTR</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidDelegates.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.name}</td>
                                            <td>{d.registrationType}</td>
                                            <td>{d.yearOfStudy}</td>
                                            <td>{d.phone}</td>
                                            <td>{d.refId}</td>
                                            <td>{d.utr}</td>
                                            <td>{d.verified ? "Verified" : "Paid"}</td>
                                            <td>
                                                {!d.verified && (
                                                    <button
                                                        className="verify-btn"
                                                        onClick={() => verifyPayment(d.id)}
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedTab === "verified" && (
                            <table className="admin-table full-width">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>College</th>
                                        <th>Phone</th>
                                        <th>Ref ID</th>
                                        <th>UTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verifiedDelegates.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.name}</td>
                                            <td>{d.email}</td>
                                            <td>{d.college}</td>
                                            <td>{d.phone}</td>
                                            <td>{d.refId}</td>
                                            <td>{d.utr}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedTab === "search" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or refId..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{
                                        marginBottom: "1rem",
                                        padding: "0.5rem",
                                        width: "100%"
                                    }}
                                />
                                {searchedDelegates.length ? (
                                    <table className="admin-table full-width">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>College</th>
                                                <th>Phone</th>
                                                <th>Ref ID</th>
                                                <th>UTR</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchedDelegates.map(d => (
                                                <tr key={d.id}>
                                                    <td>{d.name}</td>
                                                    <td>{d.email}</td>
                                                    <td>{d.college}</td>
                                                    <td>{d.phone}</td>
                                                    <td>{d.refId}</td>
                                                    <td>{d.utr}</td>
                                                    <td>
                                                        {d.verified
                                                            ? "Verified"
                                                            : d.utr !== "-"
                                                                ? "Paid"
                                                                : "Pending"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No delegates found.</p>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Admin;
