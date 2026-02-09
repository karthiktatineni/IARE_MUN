import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { db, auth } from "../firebase";
import { staticCountryData } from "../data/committees";
import "./Admin.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    LayoutDashboard, Users, CheckCircle, Globe, CreditCard, Search, LogOut, FileText, UserCog
} from 'lucide-react';

function Admin() {
    const [delegates, setDelegates] = useState([]);
    const [ocMembers, setOcMembers] = useState([]);
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

        const handleTabClose = () => {
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
        const INACTIVITY_LIMIT = 5 * 60 * 1000;

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
            // Fetch delegate registrations
            const querySnapshot = await getDocs(collection(db, "registrations"));
            const delegateList = [];

            querySnapshot.forEach(docSnap => {
                const data = docSnap.data();

                // Handle group registrations
                if (data.isGroup && data.members) {
                    // Create entry for each member in the group
                    data.members.forEach((member, idx) => {
                        delegateList.push({
                            id: docSnap.id + "_" + idx,
                            docId: docSnap.id,
                            name: member.name,
                            email: member.email,
                            college: data.college,
                            phone: member.phone,
                            registrationType: data.registrationType,
                            yearOfStudy: member.yearOfStudy,
                            rollNumber: member.rollNumber || "-",
                            munExperiences: member.munExperiences || "0",
                            munAwards: member.munAwards || "0",
                            amountToPay: data.amountToPay || "-",
                            refId: data.refId || "-",
                            utr: data.utr || "-",
                            verified: data.verified || false,
                            timestamp: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.timestamp || new Date(0).toISOString()),
                            paidAt: data.paidAt?.toDate?.() ? data.paidAt.toDate().toISOString() : null,
                            preferences: member.preferences || [],
                            allocation: member.allocation || null,
                            suggestedAllocation: null,
                            isGroup: true,
                            groupId: data.groupId,
                            groupSize: data.groupSize,
                            memberIndex: idx + 1,
                            memberNames: data.memberNames
                        });
                    });
                } else {
                    // Solo registration
                    delegateList.push({
                        id: docSnap.id,
                        docId: docSnap.id,
                        name: data.name,
                        email: data.email,
                        college: data.college,
                        phone: data.phone,
                        registrationType: data.registrationType || "-",
                        yearOfStudy: data.yearOfStudy || "-",
                        rollNumber: data.rollNumber || "-",
                        munExperiences: data.munExperiences || "0",
                        munAwards: data.munAwards || "0",
                        amountToPay: data.amountToPay || "-",
                        refId: data.refId || "-",
                        utr: data.utr || "-",
                        verified: data.verified || false,
                        timestamp: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.timestamp || new Date(0).toISOString()),
                        paidAt: data.paidAt?.toDate?.() ? data.paidAt.toDate().toISOString() : null,
                        preferences: data.preferences || [],
                        allocation: data.allocation || null,
                        suggestedAllocation: null,
                        isGroup: false,
                        groupId: null
                    });
                }
            });

            delegateList.sort((a, b) => {
                const awardsA = parseInt(a.munAwards || 0);
                const awardsB = parseInt(b.munAwards || 0);
                if (awardsA !== awardsB) return awardsB - awardsA;

                const expA = parseInt(a.munExperiences || 0);
                const expB = parseInt(b.munExperiences || 0);
                if (expA !== expB) return expB - expA;

                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            // Fetch OC registrations (handle case where collection might not exist)
            let ocList = [];
            try {
                const ocSnapshot = await getDocs(collection(db, "oc_registrations"));
                ocSnapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    ocList.push({
                        id: docSnap.id,
                        name: data.name,
                        email: data.email,
                        college: data.college,
                        phone: data.phone,
                        ocType: data.ocType || data.registrationType || "-",
                        yearOfStudy: data.yearOfStudy || "-",
                        rollNumber: data.rollNumber || "-",
                        amountToPay: data.amountToPay || "-",
                        refId: data.refId || "-",
                        utr: data.utr || "-",
                        verified: data.verified || false,
                        timestamp: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date(0).toISOString(),
                    });
                });
                ocList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            } catch (ocErr) {
                console.log("No OC registrations yet or error fetching:", ocErr);
            }
            setOcMembers(ocList);

            const newCountryData = {};
            Object.keys(staticCountryData).forEach(committee => {
                newCountryData[committee] = staticCountryData[committee].map(c => ({
                    ...c,
                    is_allocated: false,
                    allocated_to: null
                }));
            });

            // 1. Mark CONFIRMED allocations in matrix
            delegateList.forEach(delegate => {
                if (delegate.allocation) {
                    const { committee, country } = delegate.allocation;
                    const index = newCountryData[committee]?.findIndex(c => c.country === country);
                    if (index !== -1) {
                        newCountryData[committee][index].is_allocated = true;
                        newCountryData[committee][index].allocated_to = delegate.name;
                    }
                }
            });

            // 2. Calculate SUGGESTIONS (Virtual Allocation)
            // Deep copy to track availability for suggestions without affecting real matrix
            const virtualMatrix = JSON.parse(JSON.stringify(newCountryData));

            delegateList.forEach(delegate => {
                if (delegate.allocation) return; // Already allocated

                for (const pref of delegate.preferences) {
                    const committee = pref.committee;
                    if (!committee) continue;

                    for (const country of pref.countries) {
                        if (!country) continue;

                        const index = virtualMatrix[committee]?.findIndex(
                            c => c.country === country
                        );
                        if (
                            index !== -1 &&
                            !virtualMatrix[committee][index].is_allocated
                        ) {
                            // Found a spot
                            virtualMatrix[committee][index].is_allocated = true;
                            virtualMatrix[committee][index].allocated_to = delegate.name; // virtual assignment
                            delegate.suggestedAllocation = { committee, country };
                            return; // Move to next delegate
                        }
                    }
                }
            });

            setDelegates(delegateList);
            setCountryData(newCountryData);

            // Note: We do NOT auto-save the matrix here anymore, only on manual allocate.
            // But we might want to ensure the matrix is in sync if we loaded confirmed allocations.
            // For now, we only write when we click 'Allocate'.

            setLoading(false);
        } catch (err) {
            console.error(err);
            setNotification("Error fetching delegates!");
            setLoading(false);
        }
    };

    const handleAllocate = async (delegateId, docId, membersArray, memberIndex, suggested) => {
        if (!suggested) {
            alert("No allocation suggested (seats might be full or preferences unavailable).");
            return;
        }

        try {
            // Update Firestore
            // If it's a group member, we need to update the specific member in the 'members' array
            if (membersArray) {
                // It's a group
                // We need to fetch the latest doc first to avoid overwriting other concurrent updates? 
                // For simplicity, assuming 'membersArray' passed from UI is reasonably fresh or we just update the specific index in the known array.
                // A better approach for arrays in Firestore is tricky without reading. 
                // But here we constructed delegateId like "docId_idx".

                // Construct updated members array
                const updatedMembers = [...membersArray]; // This is from the 'delegate' object which might be stale if we edit directly? 
                // Actually 'delegates' state is flat. We need to find the real doc data.

                // Let's just read the current 'members' from the actual delegate object in state, which comes from fetching
                // But to be safe, let's use the docId to find the group doc locally or just update.

                // Simpler: We have docId. We can just update the specific index if we use arrayUnion/Remove? No, objects.
                // We have to write the whole members array.

                // Let's find the group doc in our 'delegates' state to get the full current members list
                // Wait, 'delegates' is flat. We need to reconstruct or find the group.

                // Helper to find the group's full member list from our flat state:
                const groupMembersInState = delegates.filter(d => d.docId === docId);
                // We need to map them back to the structure Firestore expects.
                const firestoreMembers = groupMembersInState.sort((a, b) => a.memberIndex - b.memberIndex).map(d => ({
                    name: d.name,
                    email: d.email,
                    phone: d.phone,
                    college: d.college,
                    yearOfStudy: d.yearOfStudy,
                    rollNumber: d.rollNumber,
                    munExperiences: d.munExperiences,
                    munAwards: d.munAwards,
                    preferences: d.preferences,
                    allocation: (d.memberIndex === memberIndex) ? suggested : d.allocation, // Update target
                    // ... preserve other fields if any?
                    memberIndex: d.memberIndex,
                    registrationType: d.registrationType
                    // Note: This reconstruction must match exactly what was in DB or we lose data.
                    // Risk: If we added fields and forgot them here.
                }));

                await updateDoc(doc(db, "registrations", docId), {
                    members: firestoreMembers
                });

            } else {
                // Solo
                await updateDoc(doc(db, "registrations", docId), {
                    allocation: suggested
                });
            }

            // Update Public Matrix
            // We need to update countryData state first to be safe, then push
            const newMatrix = { ...countryData };
            const { committee, country } = suggested;
            const cIndex = newMatrix[committee].findIndex(c => c.country === country);
            if (cIndex !== -1) {
                newMatrix[committee][cIndex].is_allocated = true;
                newMatrix[committee][cIndex].allocated_to = delegates.find(d => d.id === delegateId)?.name;
            }

            setCountryData(newMatrix);
            await setDoc(doc(db, "public", "countryMatrix"), {
                matrix: newMatrix,
                lastUpdated: new Date().toISOString()
            });

            // Update Local State
            setDelegates(prev => prev.map(d => {
                if (d.id === delegateId) {
                    return { ...d, allocation: suggested, suggestedAllocation: null };
                }
                return d;
            }));

            // Re-run suggestions for everyone else based on this new locked allocation?
            // Ideally yes. Because this seat is now taken.
            // We can just call a lightweight "re-suggest" function or just rely on the next render?
            // But we need to update the suggestions for OTHERS who might have wanted this seat.
            // For now, let's just alert. The user can refresh to re-calculate suggestions 
            // OR we can trigger a re-calc.
            // To effectively re-calc, we need to run step 2 of fetchAndAllocate again.

            // Quick Recalculate Suggestions
            setDelegates(prevDelegates => {
                const updatedList = [...prevDelegates];
                // Mark the one we just allocated
                const targetIndex = updatedList.findIndex(d => d.id === delegateId);
                if (targetIndex !== -1) {
                    updatedList[targetIndex].allocation = suggested;
                    updatedList[targetIndex].suggestedAllocation = null;
                }

                // Re-eval virtual matrix
                const virtualMatrix = JSON.parse(JSON.stringify(newMatrix)); // Uses the updated matrix with the new allocation

                updatedList.forEach(del => {
                    if (del.allocation) return;

                    // clear old suggestion
                    del.suggestedAllocation = null;

                    for (const pref of del.preferences) {
                        const comm = pref.committee;
                        if (!comm) continue;
                        for (const count of pref.countries) {
                            if (!count) continue;
                            const idx = virtualMatrix[comm]?.findIndex(c => c.country === count);
                            if (idx !== -1 && !virtualMatrix[comm][idx].is_allocated) {
                                virtualMatrix[comm][idx].is_allocated = true;
                                virtualMatrix[comm][idx].allocated_to = del.name;
                                del.suggestedAllocation = { committee: comm, country: count };
                                return;
                            }
                        }
                    }
                });
                return updatedList;
            });

            // alert("Allocation Confirmed!"); 

        } catch (err) {
            console.error(err);
            alert("Failed to allocate.");
        }
    };

    const handleDeallocate = async (delegateId, docId, membersArray, memberIndex) => {
        if (!window.confirm("Are you sure you want to remove this allocation?")) return;

        try {
            // Find the delegate to get current allocation
            const delegate = delegates.find(d => d.id === delegateId);
            if (!delegate || !delegate.allocation) return;

            const { committee, country } = delegate.allocation;

            // Update Firestore
            if (membersArray) {
                // Group Logic
                const groupMembersInState = delegates.filter(d => d.docId === docId);
                const firestoreMembers = groupMembersInState.sort((a, b) => a.memberIndex - b.memberIndex).map(d => ({
                    name: d.name,
                    email: d.email,
                    phone: d.phone,
                    college: d.college,
                    yearOfStudy: d.yearOfStudy,
                    rollNumber: d.rollNumber,
                    munExperiences: d.munExperiences,
                    munAwards: d.munAwards,
                    preferences: d.preferences,
                    allocation: (d.memberIndex === memberIndex) ? null : d.allocation, // Remove allocation
                    memberIndex: d.memberIndex,
                    registrationType: d.registrationType
                }));

                await updateDoc(doc(db, "registrations", docId), {
                    members: firestoreMembers
                });

            } else {
                // Solo Logic
                await updateDoc(doc(db, "registrations", docId), {
                    allocation: null
                });
            }

            // Update Public Matrix
            const newMatrix = { ...countryData };
            const cIndex = newMatrix[committee]?.findIndex(c => c.country === country);
            if (cIndex !== -1) {
                newMatrix[committee][cIndex].is_allocated = false;
                newMatrix[committee][cIndex].allocated_to = null;
            }

            setCountryData(newMatrix);
            await setDoc(doc(db, "public", "countryMatrix"), {
                matrix: newMatrix,
                lastUpdated: new Date().toISOString()
            });

            // Update Local State
            setDelegates(prev => prev.map(d => {
                if (d.id === delegateId) {
                    return { ...d, allocation: null, suggestedAllocation: null };
                }
                return d;
            }));

            alert("Allocation removed successfully.");

        } catch (err) {
            console.error(err);
            alert("Failed to remove allocation.");
        }
    };

    const verifyPayment = async (delegateId, isOC = false) => {
        try {
            const collectionName = isOC ? "oc_registrations" : "registrations";
            await updateDoc(doc(db, collectionName, delegateId), {
                verified: true
            });

            if (isOC) {
                setOcMembers(prev =>
                    prev.map(d =>
                        d.id === delegateId ? { ...d, verified: true } : d
                    )
                );
            } else {
                setDelegates(prev =>
                    prev.map(d =>
                        d.docId === delegateId ? { ...d, verified: true } : d
                    )
                );
            }
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
            "Reg Time", "Name", "Email", "Phone", "College/School", "Reg Type", "Year/Grade", "Roll No",
            "MUN Exp", "MUN Awards",
            "Group ID", "Group Size",
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
                d.rollNumber || "-",
                d.munExperiences || "0",
                d.munAwards || "0",
                d.groupId || "-",
                d.groupSize || "-",
                ...prefsColumns,
                d.refId,
                d.amountToPay,
                d.utr,
                paidAtStr,
                d.verified ? "Verified" : (d.utr !== "-" ? "Paid" : "Pending"),
                allocationStr
            ].map(field => `"${field}"`);
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
    const groupDelegates = delegates.filter(d => d.isGroup);
    const soloDelegates = delegates.filter(d => !d.isGroup);

    const paidOC = ocMembers.filter(d => d.utr !== "-");
    const verifiedOC = ocMembers.filter(d => d.verified);

    const searchedDelegates = delegates.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.groupId && d.groupId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.rollNumber && d.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Chart Data Calculations
    const regTypeData = [
        { name: 'External Solo', value: delegates.filter(d => d.registrationType?.includes('External') && !d.isGroup).length },
        { name: 'Internal Solo', value: delegates.filter(d => d.registrationType?.includes('Internal') && !d.isGroup).length },
        { name: 'School Solo', value: delegates.filter(d => d.registrationType?.includes('School') && !d.isGroup).length },
        { name: 'External Group', value: delegates.filter(d => d.registrationType?.includes('External') && d.isGroup).length },
        { name: 'Internal Group', value: delegates.filter(d => d.registrationType?.includes('Internal') && d.isGroup).length },
        { name: 'School Group', value: delegates.filter(d => d.registrationType?.includes('School') && d.isGroup).length },
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

    // Group delegates by groupId for display
    const groupedByGroupId = {};
    groupDelegates.forEach(d => {
        if (!groupedByGroupId[d.groupId]) {
            groupedByGroupId[d.groupId] = [];
        }
        groupedByGroupId[d.groupId].push(d);
    });

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
                        className={`nav-item ${selectedTab === "group_delegations" ? "active" : ""} `}
                        onClick={() => setSelectedTab("group_delegations")}
                    >
                        <Users size={18} />
                        <span>Group Delegations</span>
                    </button>

                    <button
                        className={`nav-item ${selectedTab === "oc_members" ? "active" : ""} `}
                        onClick={() => setSelectedTab("oc_members")}
                    >
                        <UserCog size={18} />
                        <span>OC Members</span>
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
                                    <h3>Solo Delegates</h3>
                                    <p>{soloDelegates.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Group Members</h3>
                                    <p>{groupDelegates.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>OC Members</h3>
                                    <p>{ocMembers.length}</p>
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
                                            <th>Roll No</th>
                                            <th>Exp</th>
                                            <th>Awards</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>College/School</th>
                                            <th>Group ID</th>
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
                                            <tr key={d.id} className={d.isGroup ? "group-row" : ""}>
                                                <td>{new Date(d.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                                                <td>
                                                    {d.name}
                                                    {d.isGroup && <span className="group-badge-small">Group</span>}
                                                </td>
                                                <td>{d.registrationType}</td>
                                                <td>{d.yearOfStudy}</td>
                                                <td>{d.rollNumber}</td>
                                                <td>{d.munExperiences || 0}</td>
                                                <td>{d.munAwards || 0}</td>
                                                <td>{d.email}</td>
                                                <td>{d.phone}</td>
                                                <td>{d.college}</td>
                                                <td>{d.groupId || "-"}</td>
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

                        {selectedTab === "group_delegations" && (
                            <div className="admin-table-container custom-scrollbar">
                                <h3 className="section-title">Group Delegations ({Object.keys(groupedByGroupId).length} groups, {groupDelegates.length} members)</h3>
                                {Object.keys(groupedByGroupId).length === 0 ? (
                                    <p>No group delegations yet.</p>
                                ) : (
                                    Object.entries(groupedByGroupId).map(([groupId, members]) => (
                                        <div key={groupId} className="group-card">
                                            <div className="group-header">
                                                <h4>Group: {groupId}</h4>
                                                <span className="group-meta">
                                                    {members[0].registrationType} | {members.length} members |
                                                    Ref: {members[0].refId} |
                                                    Status: <span className={`status-tag ${members[0].verified ? "verified" : (members[0].utr !== "-" ? "paid" : "pending")}`}>
                                                        {members[0].verified ? "Verified" : (members[0].utr !== "-" ? "Paid" : "Pending")}
                                                    </span>
                                                </span>
                                            </div>
                                            <table className="admin-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Year/Grade</th>
                                                        <th>Exp</th>
                                                        <th>Awards</th>
                                                        <th>Pref 1</th>
                                                        <th>Pref 2</th>
                                                        <th>Pref 3</th>
                                                        <th>Allocation</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {members.map((m, idx) => (
                                                        <tr key={m.id}>
                                                            <td>{idx + 1}</td>
                                                            <td>{m.name}</td>
                                                            <td>{m.email}</td>
                                                            <td>{m.phone}</td>
                                                            <td>{m.yearOfStudy}</td>
                                                            <td>{m.munExperiences || 0}</td>
                                                            <td>{m.munAwards || 0}</td>
                                                            {[0, 1, 2].map(i => {
                                                                const pref = m.preferences[i];
                                                                return (
                                                                    <td key={i}>
                                                                        {pref
                                                                            ? `${pref.committee} - ${pref.countries.slice(0, 2).join(", ")}`
                                                                            : "-"}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td>
                                                                {m.allocation
                                                                    ? `${m.allocation.committee} (${m.allocation.country})`
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {selectedTab === "oc_members" && (
                            <div className="admin-table-container custom-scrollbar">
                                <h3 className="section-title">OC Members ({ocMembers.length} total)</h3>
                                <table className="admin-table full-width">
                                    <thead>
                                        <tr>
                                            <th>Reg Time</th>
                                            <th>Name</th>
                                            <th>OC Type</th>
                                            <th>Year</th>
                                            <th>Roll No</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>College</th>
                                            <th>Ref ID</th>
                                            <th>Amount</th>
                                            <th>UTR</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ocMembers.map(d => (
                                            <tr key={d.id}>
                                                <td>{new Date(d.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                                                <td>{d.name}</td>
                                                <td>{d.ocType}</td>
                                                <td>{d.yearOfStudy}</td>
                                                <td>{d.rollNumber}</td>
                                                <td>{d.email}</td>
                                                <td>{d.phone}</td>
                                                <td>{d.college}</td>
                                                <td>{d.refId}</td>
                                                <td>{d.amountToPay}</td>
                                                <td>{d.utr}</td>
                                                <td>
                                                    <span className={`status-tag ${d.verified ? "verified" : (d.utr !== "-" ? "paid" : "pending")}`}>
                                                        {d.verified ? "Verified" : (d.utr !== "-" ? "Paid" : "Pending")}
                                                    </span>
                                                </td>
                                                <td>
                                                    {!d.verified && d.utr !== "-" && (
                                                        <button
                                                            className="verify-btn"
                                                            onClick={() => verifyPayment(d.id, true)}
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {ocMembers.length === 0 && (
                                            <tr>
                                                <td colSpan="12" style={{ textAlign: "center" }}>
                                                    No OC members registered yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedTab === "allocated_delegates" && (
                            <div className="admin-table-container custom-scrollbar">
                                <h3 className="section-title">Allocation Management</h3>
                                <p style={{ color: "#888", marginBottom: "1rem" }}>
                                    Review suggested allocations based on priority (Awards {'>'} Experience {'>'} Time).
                                    Click "Allocate" to confirm and publish to the Country Matrix.
                                </p>
                                <table className="admin-table full-width">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Priority</th>
                                            <th>Preferences (Comm - Country)</th>
                                            <th>Status</th>
                                            <th>Allocation / Suggestion</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {delegates.map(d => (
                                            <tr key={d.id} className={d.isGroup ? "group-row" : ""}>
                                                <td>
                                                    {d.name}
                                                    {d.isGroup && <span className="group-badge-small">Group</span>}
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: "0.85rem" }}>
                                                        🏆 {d.munAwards || 0} <br />
                                                        ⭐ {d.munExperiences || 0}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: "0.85rem" }}>
                                                        {d.preferences.map((p, i) => (
                                                            <div key={i}>
                                                                {i + 1}. {p.committee} - {p.countries.filter(Boolean).join(", ")}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    {d.allocation ?
                                                        <span className="status-tag verified">Allocated</span> :
                                                        <span className="status-tag pending">Pending</span>
                                                    }
                                                </td>
                                                <td>
                                                    {d.allocation ? (
                                                        <span style={{ color: "var(--neon-green)", fontWeight: "bold" }}>
                                                            {d.allocation.committee} - {d.allocation.country}
                                                        </span>
                                                    ) : d.suggestedAllocation ? (
                                                        <span style={{ color: "var(--gold)" }}>
                                                            Suggest: {d.suggestedAllocation.committee} - {d.suggestedAllocation.country}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "#666" }}>No Preference Available</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {!d.allocation && d.suggestedAllocation && (
                                                        <button
                                                            className="verify-btn"
                                                            style={{ backgroundColor: "var(--gold)", color: "black" }}
                                                            onClick={() => handleAllocate(
                                                                d.id,
                                                                d.docId,
                                                                d.isGroup ? delegates.filter(m => m.docId === d.docId) : null,
                                                                d.memberIndex,
                                                                d.suggestedAllocation
                                                            )}
                                                        >
                                                            Allocate
                                                        </button>
                                                    )}
                                                    {d.allocation && (
                                                        <button
                                                            className="verify-btn"
                                                            style={{ backgroundColor: "#ff4444", color: "white" }}
                                                            onClick={() => handleDeallocate(
                                                                d.id,
                                                                d.docId,
                                                                d.isGroup ? delegates.filter(m => m.docId === d.docId) : null,
                                                                d.memberIndex
                                                            )}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                        <tr key={d.id} className={d.isGroup ? "group-row" : ""}>
                                            <td>
                                                {d.name}
                                                {d.isGroup && <span className="group-badge-small">Group</span>}
                                            </td>
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
                                                        onClick={() => verifyPayment(d.docId)}
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
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verifiedDelegates.map(d => (
                                        <tr key={d.id} className={d.isGroup ? "group-row" : ""}>
                                            <td>
                                                {d.name}
                                                {d.isGroup && <span className="group-badge-small">Group</span>}
                                            </td>
                                            <td>{d.email}</td>
                                            <td>{d.college}</td>
                                            <td>{d.phone}</td>
                                            <td>{d.refId}</td>
                                            <td>{d.utr}</td>
                                            <td>{d.registrationType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedTab === "search" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, refId, or groupId..."
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
                                                <th>Type</th>
                                                <th>Roll No</th>
                                                <th>Group ID</th>
                                                <th>Ref ID</th>
                                                <th>UTR</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchedDelegates.map(d => (
                                                <tr key={d.id} className={d.isGroup ? "group-row" : ""}>
                                                    <td>
                                                        {d.name}
                                                        {d.isGroup && <span className="group-badge-small">Group</span>}
                                                    </td>
                                                    <td>{d.email}</td>
                                                    <td>{d.college}</td>
                                                    <td>{d.phone}</td>
                                                    <td>{d.registrationType}</td>
                                                    <td>{d.rollNumber || "-"}</td>
                                                    <td>{d.groupId || "-"}</td>
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
