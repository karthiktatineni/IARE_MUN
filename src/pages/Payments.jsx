import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import "./Payments.css";

// Pricing Constants
const PRICING = {
    // Delegate Solo Pricing
    "School Solo Delegates": { base: 999 },
    "Internal Solo Delegates": { "1st Year": 999, default: 1299 },
    "External Solo Delegates": { "1st Year": 1199, default: 1399 },

    // Delegate Group Pricing (per delegate)
    "School Group Delegation": { perMember: 859 },
    "Internal Group Delegation": { perMember: 1199 },
    "External Group Delegation": { perMember: 1299 },

    // OC Pricing
    "Internal OC": { "1st Year": 799, default: 899 },
    "External OC": { "1st Year": 899, default: 999 },
};

function Payments() {
    const [searchParams] = useSearchParams();
    const refId = searchParams.get("ref");
    const isOC = searchParams.get("type") === "oc";

    const [qrUrl, setQrUrl] = useState("");
    const [utr, setUtr] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [amount, setAmount] = useState(0);
    const [delegateName, setDelegateName] = useState("");
    const [registrationData, setRegistrationData] = useState(null);

    const calculateAmount = (data, isOCReg) => {
        const { registrationType, yearOfStudy, groupSize, isGroup, members } = data;

        // OC Registration
        if (isOCReg || registrationType === "Internal OC" || registrationType === "External OC") {
            const pricing = PRICING[registrationType];
            if (!pricing) return 999; // fallback
            return yearOfStudy === "1st Year" ? pricing["1st Year"] : pricing.default;
        }

        // Group Delegation
        if (isGroup && groupSize) {
            const pricing = PRICING[registrationType];
            if (pricing && pricing.perMember) {
                return pricing.perMember * groupSize;
            }
        }

        // Solo Delegates
        if (registrationType === "School Solo Delegates") {
            return PRICING["School Solo Delegates"].base;
        }

        if (registrationType === "Internal Solo Delegates") {
            return yearOfStudy === "1st Year"
                ? PRICING["Internal Solo Delegates"]["1st Year"]
                : PRICING["Internal Solo Delegates"].default;
        }

        if (registrationType === "External Solo Delegates") {
            return yearOfStudy === "1st Year"
                ? PRICING["External Solo Delegates"]["1st Year"]
                : PRICING["External Solo Delegates"].default;
        }

        // Fallback for legacy registration types
        if (registrationType?.includes("School")) return 999;
        if (registrationType?.includes("Internal")) return yearOfStudy === "1st Year" ? 999 : 1299;
        if (registrationType?.includes("External")) return yearOfStudy === "1st Year" ? 1199 : 1399;

        return 1000; // Default fallback
    };

    useEffect(() => {
        if (!refId) return;

        const fetchDetailsAndGenerateQR = async () => {
            try {
                // Try delegate registrations first
                let collectionName = "registrations";
                let q = query(collection(db, collectionName), where("refId", "==", refId));
                let snapshot = await getDocs(q);

                // If not found in registrations, try OC registrations
                if (snapshot.empty) {
                    collectionName = "oc_registrations";
                    q = query(collection(db, collectionName), where("refId", "==", refId));
                    snapshot = await getDocs(q);
                }

                if (snapshot.empty) {
                    console.error("No registration found with this Ref ID");
                    return;
                }

                const data = snapshot.docs[0].data();
                setRegistrationData({ ...data, collectionName, docId: snapshot.docs[0].id });

                // Set display name
                if (data.isGroup && data.memberNames) {
                    setDelegateName(data.memberNames.join(", "));
                } else {
                    setDelegateName(data.name);
                }

                // Check if already paid
                if (data.utr && data.utr !== "-" && data.utr.length > 5) {
                    setUtr(data.utr);
                    setSuccess(true);
                }

                const calculatedAmount = calculateAmount(data, collectionName === "oc_registrations");
                setAmount(calculatedAmount);


                const upiLink = `upi://pay?pa=cheerfulsathvika6102@okaxis&pn=Konda Naga sathvika&am=${calculatedAmount}&tn=Reg Fee ${refId}&tr=${refId}`;

                QRCode.toDataURL(upiLink)
                    .then((url) => setQrUrl(url))
                    .catch((err) => console.error("QR Code generation failed", err));

                const docRef = doc(db, collectionName, snapshot.docs[0].id);
                await updateDoc(docRef, { amountToPay: calculatedAmount });

            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchDetailsAndGenerateQR();
    }, [refId]);

    const sendToGoogleSheets = async (delegateData) => {
        const scriptUrl = import.meta.env.VITE_SHEETS_API_URL;
        if (!scriptUrl) {
            console.warn("Google Sheets API URL not found in .env. Skipping secondary database sync.");
            return;
        }

        try {
            let flattenedData;

            if (delegateData.isGroup) {

                flattenedData = {
                    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                    name: delegateData.memberNames?.join(", ") || "-",
                    email: delegateData.members?.map(m => m.email).join(", ") || "-",
                    phone: delegateData.members?.map(m => m.phone).join(", ") || "-",
                    college: delegateData.college,
                    registrationType: delegateData.registrationType,
                    yearOfStudy: delegateData.members?.map(m => m.yearOfStudy).join(", ") || "-",
                    refId: delegateData.refId,
                    groupSize: delegateData.groupSize,
                    groupId: delegateData.groupId,
                    amount: amount,
                    utr: utr.trim(),
                    isGroup: true,
                };
            } else {
                // For solo registrations
                flattenedData = {
                    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                    name: delegateData.name,
                    email: delegateData.email,
                    phone: delegateData.phone,
                    college: delegateData.college,
                    registrationType: delegateData.registrationType,
                    yearOfStudy: delegateData.yearOfStudy,
                    refId: delegateData.refId,
                    amount: amount,
                    utr: utr.trim(),
                    pref1_committee: delegateData.preferences?.[0]?.committee || "-",
                    pref1_countries: delegateData.preferences?.[0]?.countries?.join(", ") || "-",
                    pref2_committee: delegateData.preferences?.[1]?.committee || "-",
                    pref2_countries: delegateData.preferences?.[1]?.countries?.join(", ") || "-",
                    pref3_committee: delegateData.preferences?.[2]?.committee || "-",
                    pref3_countries: delegateData.preferences?.[2]?.countries?.join(", ") || "-",
                };
            }

            await fetch(scriptUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: [flattenedData]
                }),
            });
            console.log("Secondary database sync successful (Google Sheets)");
        } catch (error) {
            console.error("Secondary database sync failed:", error);
        }
    };

    const submitPayment = async () => {
        if (!utr.trim()) {
            alert("Please enter your UPI Transaction ID (UTR)");
            return;
        }

        if (!/^\d{12}$/.test(utr.trim())) {
            alert("Please enter a valid 12-digit UTR number.");
            return;
        }

        setLoading(true);

        try {
            if (!registrationData) {
                alert("Registration not found!");
                setLoading(false);
                return;
                setLoading(false);
                return;
            }

            // Check for duplicate UTR in both collections
            const utrQuery1 = query(collection(db, "registrations"), where("utr", "==", utr.trim()));
            const utrCheck1 = await getDocs(utrQuery1);

            const utrQuery2 = query(collection(db, "oc_registrations"), where("utr", "==", utr.trim()));
            const utrCheck2 = await getDocs(utrQuery2);

            // Filter out the current user's own doc if they represent-submit (rare, but good for safety)
            const isDuplicate = [...utrCheck1.docs, ...utrCheck2.docs].some(d => d.id !== registrationData.docId);

            if (isDuplicate) {
                alert("This UTR has already been submitted by another user. Please check your transaction ID.");
                setLoading(false);
                return;
            }

            const delegateRef = doc(db, registrationData.collectionName, registrationData.docId);

            // Update with UTR and payment timestamp
            await updateDoc(delegateRef, {
                utr: utr.trim(),
                paidAt: serverTimestamp(),
            });

            // Sync with Google Sheets (Secondary Database)
            await sendToGoogleSheets(registrationData);

            setSuccess(true);
            alert("✅ Payment recorded successfully!");
        } catch (error) {
            console.error("Payment update failed:", error);
            alert("❌ Failed to record payment. Please try again.");
        }

        setLoading(false);
    };

    const getRegistrationTypeLabel = () => {
        if (!registrationData) return "";
        if (registrationData.isGroup) {
            return `${registrationData.registrationType} (${registrationData.groupSize} members)`;
        }
        return registrationData.registrationType;
    };

    return (
        <div className="payment-page">
            <div className="payment-box">
                <h2>MUN IARE – Registration Fee</h2>
                <p className="info">
                    Welcome, <b>{delegateName}</b><br />
                    {registrationData?.isGroup && (
                        <span className="group-badge">Group Registration - {registrationData.groupSize} members</span>
                    )}<br />
                    Scan the QR code and complete the payment.<br />
                    After payment, enter your UPI Transaction ID (UTR).
                </p>

                <div id="qr">
                    {qrUrl ? (
                        <img src={qrUrl} alt="Payment QR Code" />
                    ) : (
                        <p>Loading Payment Details...</p>
                    )}
                </div>

                <p className="info">
                    Registration Type: <b>{getRegistrationTypeLabel()}</b><br />
                    Amount: <b>₹{amount}</b><br />
                    Reference: <b>{refId || "N/A"}</b>
                </p>

                {registrationData?.isGroup && (
                    <div className="group-breakdown">
                        <p>₹{PRICING[registrationData.registrationType]?.perMember || 0} × {registrationData.groupSize} members = ₹{amount}</p>
                    </div>
                )}

                {!success ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter UPI Transaction ID (UTR)"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            className="utr-input"
                        />
                        <button className="btn-payment" onClick={submitPayment} disabled={loading || !refId || amount === 0}>
                            {loading ? "Submitting..." : "Submit Payment"}
                        </button>
                    </>
                ) : (
                    <div id="paymentReceipt">
                        <h3>Payment Receipt</h3>
                        <p><b>Reference ID:</b> {refId}</p>
                        <p><b>Amount Paid:</b> ₹{amount}</p>
                        <p><b>UTR:</b> {utr}</p>
                        <p><b>Date:</b> {new Date().toLocaleString()}</p>
                    </div>
                )}

                <p className="note">
                    Your registration confirmation mail will be sent after payment verification.
                </p>
            </div>
        </div>
    );
}

export default Payments;
